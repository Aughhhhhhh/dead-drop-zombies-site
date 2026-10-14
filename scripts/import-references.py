import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

import markdown


class SafeHtml(HTMLParser):
    tags = {'p', 'ul', 'ol', 'li', 'strong', 'em', 'h2', 'h3', 'h4', 'code', 'pre', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br', 'a'}

    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.tags:
            return
        if tag == 'a':
            href = dict(attrs).get('href', '')
            if urlparse(href).scheme != 'https':
                href = ''
            self.parts.append(f'<a href="{html.escape(href, quote=True)}" target="_blank" rel="noopener noreferrer">')
        else:
            self.parts.append(f'<{tag}>')

    def handle_endtag(self, tag):
        if tag in self.tags and tag not in {'br', 'hr'}:
            self.parts.append(f'</{tag}>')

    def handle_data(self, data):
        self.parts.append(html.escape(data))


def source_markdown(text, url):
    def citation(match):
        title = match.group(1)
        target = title if title.startswith('https://') else url
        title = title.replace('[', '').replace(']', '')
        if title == 'Image':
            title = 'Image in the original source'
        return f'[{title}]({target})'

    text = re.sub(r'cite[^†]+†([^†]+)(?:†[^]+)?', citation, text)
    text = re.sub(r'\^\{([^}]+)\}', r'\1', text)
    return html.escape(text, quote=False)


def category(title):
    title = title.lower()
    if any(word in title for word in ['main quest', 'main easter', 'trophy', 'achievement', 'endgame']):
        return 'main'
    if any(word in title for word in ['song', 'music']):
        return 'music'
    if any(word in title for word in ['buildable', 'weapon', 'staff', 'bow', 'sword', 'key feature', 'equipment']):
        return 'weapon'
    return 'side'


root = Path(__file__).resolve().parents[1]
snapshots = json.loads((root / 'output/reference-snapshots.json').read_text(encoding='utf-8'))
sources = json.loads((root / 'data/reddit-sources.json').read_text(encoding='utf-8'))
references = []
for snapshot in snapshots:
    lines = {int(index): text for index, text in snapshot['lines'].items()}
    end = next((index for index, text in sorted(lines.items()) if index > 20 and (re.match(r'^#{1,3} Author.s Notes', text) or text.startswith('Last revised by'))), snapshot['total'])
    body = [(index, text) for index, text in sorted(lines.items()) if 20 <= index < end]
    if sum(text.count('CHANGE ME') for _, text in body) > 30:
        continue
    headings = [(index, len(match.group(1)), match.group(2)) for index, text in body if (match := re.match(r'^(#{1,3}) (.+)', text)) and 'Complete Map' not in match.group(2)]
    if not headings:
        continue
    level = min(heading[1] for heading in headings)
    chapters = [heading for heading in headings if heading[1] == level]
    sections = []
    missing = False
    for offset, (start, _, title) in enumerate(chapters):
        stop = chapters[offset + 1][0] if offset + 1 < len(chapters) else end
        content = '\n'.join(text for index, text in body if start < index < stop)
        if not content.strip(' \n*'):
            continue
        gaps = any(index not in lines for index in range(start, stop))
        if gaps or len(content) > 90000:
            missing = True
            sections.append({'title': title, 'category': category(title), 'text': 'Full transcription remains at the source.', 'html': '', 'sourceOnly': True})
            continue
        content = content.replace('CHANGE ME', '[Section unfinished in the original source]')
        rendered = markdown.markdown(source_markdown(content, snapshot['url']), extensions=['tables', 'sane_lists'])
        safe = SafeHtml()
        safe.feed(rendered)
        topic_categories = sorted({category(title), *(category(heading) for heading in re.findall(r'^#{1,4} (.+)', content, re.M))})
        sections.append({'title': title, 'category': category(title), 'categories': topic_categories, 'text': re.sub(r'cite[^]+', '', content), 'html': ''.join(safe.parts)})
    if not sections:
        continue
    references.append({'url': snapshot['url'], 'mapIds': [source['mapId'] for source in sources if source['url'] == snapshot['url']], 'fetched': '2026-10-13', 'note': 'Some large cipher transcriptions remain in the original guide; those chapters link to the source.' if missing else '', 'sections': sections})

assert all(reference['mapIds'] and reference['sections'] for reference in references)
assert all(not re.search(r'<script|on\w+=|javascript:', section['html'], re.I) for reference in references for section in reference['sections'])
(root / 'data/references.json').write_text(json.dumps(references, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
print(f"Saved {len(references)} attributed references, {sum(len(reference['mapIds']) for reference in references)} map entries, {sum(len(reference['sections']) for reference in references)} chapters.")
