import html
import json
import re
import unicodedata
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
        elif tag == 'ol' and re.fullmatch(r'\d{1,4}', dict(attrs).get('start', '')):
            self.parts.append(f'<ol start="{dict(attrs)["start"]}">')
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


def without_lyrics(text):
    return re.sub(r'(?im)^.*cite[^]*†lyrics.*\n(?:[ \t]*>[^\n]*(?:\n|$)|[ \t]*\n)*', '', text)


def category(title):
    title = title.lower()
    if any(word in title for word in ['main quest', 'main easter', 'trophy', 'achievement', 'endgame']):
        return 'main'
    if any(word in title for word in ['song', 'music', 'soundtrack', 'lullaby', 'archangel', 'shepard of fire', 'shepherd of fire', "'aether'"]):
        return 'music'
    if any(word in title for word in ['buildable', 'weapon', 'staff', 'bow', 'sword', 'equipment', 'pack-a-punch', 'pack a punch', 'upgrade', 'shield', 'gauntlet', 'ripsaw', 'tesla', 'venom', 'incantation', 'kt-4', 'masamune', 'raygun', 'ray gun', 'wonder', 'hand of', 'ragnarok', 'thundergun', 'blundergat', 'acidgat', 'magmagat', 'spork', 'scalpel', 'apothicon servant', "hell's retriever", "hell's redeemer", 'maxis drone', 'wrath of the ancients', 'caliburn', 'durendal', 'balmung', 'solais', 'crafting', 'spoon', 'entangler', 'n31l', "lil' arnie", 'brm wallbuy', "ppsh-41", 'scavenger', 'vr-11', '31-79']):
        return 'weapon'
    return 'side'


def plain(text):
    text = re.sub(r'cite[^†]+†([^†]+)(?:†[^]+)?', lambda match: '' if match[1] == 'Image' else match[1], text)
    text = re.sub(r'\^\{([^}]+)\}', r'\1', text)
    return re.sub(r'[\s]+', ' ', text).strip(' *#\n')


def rendered(text, url):
    text = re.sub(r'(?m)^((?!\s*(?:\d+\. |[*#|>-])).+\S)\n( {0,3}\d+\. )', r'\1\n\n\2', text)
    text = re.sub(r'(?m)^( +\S[^\n]*)\n([^\s#*>\d|])', r'\1\n\n\2', text)
    text = re.sub(r'(?m)^([^\n]+\|[^\n]+)\n([ :|-]+\|[ :|-]+)\n', r'\n\1\n\2\n', text)
    safe = SafeHtml()
    safe.feed(markdown.markdown(source_markdown(text, url), extensions=['tables', 'sane_lists']))
    return ''.join(safe.parts)


def slug(text):
    text = unicodedata.normalize('NFKD', plain(text)).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')


def chunks(text):
    headings = list(re.finditer(r'^(#{2,5}) (.+)$', text, re.M))
    if not headings:
        return '', []
    level = min(len(heading[1]) for heading in headings)
    headings = [heading for heading in headings if len(heading[1]) == level]
    parts = [(plain(heading[2]), text[heading.end():headings[i + 1].start() if i + 1 < len(headings) else len(text)].strip()) for i, heading in enumerate(headings)]
    return text[:headings[0].start()].strip(), parts


def numbered_parts(text):
    items = list(re.finditer(r'^ {0,3}\d+\. (.+)$', text, re.M))
    if len(items) < 2:
        return []
    parts = []
    if plain(text[:items[0].start()]).strip(' *'):
        parts.append(('Preparation & context', text[:items[0].start()]))
    for i, item in enumerate(items):
        body = text[item.start():items[i + 1].start() if i + 1 < len(items) else len(text)]
        title = plain(item[1]).split('. ')[0]
        if len(title) > 85:
            title = title[:82].rsplit(' ', 1)[0] + '…'
        parts.append((title, body))
    return parts


def steps_for(text, url, split_intro=False):
    intro, sections = chunks(text)
    parts = []
    if sections:
        if plain(intro).strip(' *'):
            parts.extend((numbered_parts(intro) if split_intro else []) or [('Preparation & context', intro)])
        parts.extend(sections)
    else:
        parts = numbered_parts(text) or [('Instructions & locations', text)]
    result = []
    titles = set()
    for title, body in parts:
        title = title or 'Instructions & locations'
        if not re.search(r'[A-Za-z]', plain(body)) or re.fullmatch(r'[\d.\s]*(?:TBD|TBA|TODO|WIP)[.\s]*', plain(body)):
            continue
        if title in titles:
            title += f' ({len(result) + 1})'
        titles.add(title)
        result.append({'title': title, 'body': plain(body), 'html': rendered(body, url)})
    return result


def topics_for(section):
    title, text = section['title'], section['text']
    if title == 'Relics':
        text = re.sub(r"(?m)^([A-Z][A-Z '\u2019-]{2,75})$", r'## \1', text)
        intro, relics = chunks(text)
        for name, body in relics:
            yield name.title() + ' relic', intro + '\n\n' + body
        if relics:
            return
    if category(title) == 'main' and ('quest' in title.lower() or 'easter egg' in title.lower()):
        yield title, text
        if 'You Have Failed This City' not in text:
            return
        # Bows are nested inside Der Eisendrache's first main-quest chapter.
        for name, body in chunks(text)[1]:
            if 'You Have Failed This City' in name:
                yield from chunks(body)[1]
        return
    excluded = r'^(?:storyline|media|tips|additional|trophies|achievements|dark ops|.*chronicles|.*remaster|miscellaneous|wall-buys|loadout|intel)'
    if re.search(excluded, title, re.I):
        return
    intro, topics = chunks(text)
    if not topics:
        yield title, text
        return
    containers = {'elemental staffs', 'god hand wonder weapons', 'wonder weapons', 'incantations/rituals', 'buildables', 'bastard sword', 'mixologist (free perks)', 'blundergat', 'spoon', "hell's retriever", 'ray gun mark ii'}
    for name, body in topics:
        if re.search(r'^(?:the map layout|layout|transport|weapons|perks|power-ups|gobblegum|mystery box|buildable tables|new weapons|characters|cinematics|storyline|lore|ciphers|radios|special enemies|special zombies|special rounds)$', name, re.I):
            continue
        context, children = chunks(body)
        if name.lower() in containers and children:
            if len(plain(context).split()) > 10:
                yield name, context
            for child, content in children:
                yield child, (context + '\n\n' + content).strip()
        else:
            yield name, body


root = Path(__file__).resolve().parents[1]
snapshots = json.loads((root / 'output/reference-snapshots.json').read_text(encoding='utf-8'))
sources = json.loads((root / 'data/reddit-sources.json').read_text(encoding='utf-8'))
references = []
for snapshot in snapshots:
    lines = {int(index): text for index, text in snapshot['lines'].items()}
    if any('page has been disabled' in text.lower() or 'page does not exist' in text.lower() for text in lines.values()):
        continue
    if any(text == '## General Guidelines' for text in lines.values()):
        continue
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
        title = plain(re.sub(r'cite[^]+', '', title))
        stop = chapters[offset + 1][0] if offset + 1 < len(chapters) else end
        content = without_lyrics('\n'.join(text for index, text in body if start < index < stop))
        if not content.strip(' \n*'):
            continue
        gaps = any(index not in lines for index in range(start, stop))
        if gaps or len(content) > 90000:
            missing = True
            sections.append({'title': title, 'category': category(title), 'text': 'Full transcription remains at the source.', 'html': '', 'sourceOnly': True})
            continue
        content = content.replace('CHANGE ME', '[Section unfinished in the original source]')
        topic_categories = sorted({category(title), *(category(heading) for heading in re.findall(r'^#{1,4} (.+)', content, re.M))})
        sections.append({'title': plain(title), 'category': category(title), 'categories': topic_categories, 'text': content, 'html': rendered(content, snapshot['url'])})
    if not sections:
        continue
    references.append({'url': snapshot['url'], 'mapIds': [source['mapId'] for source in sources if source['url'] == snapshot['url']], 'fetched': '2026-10-13', 'note': 'Some large cipher transcriptions remain in the original guide; those chapters link to the source.' if missing else '', 'sections': sections})

assert all(reference['mapIds'] and reference['sections'] for reference in references)
assert all(not re.search(r'<script|on\w+=|javascript:', section['html'], re.I) for reference in references for section in reference['sections'])
(root / 'data/references.json').write_text(json.dumps(references, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
print(f"Saved {len(references)} attributed references, {sum(len(reference['mapIds']) for reference in references)} map entries, {sum(len(reference['sections']) for reference in references)} chapters.")

assert len(steps_for('1. First action\n   * Keep this location\n2. Second action\n\nName | Value\n--- | ---\nA | B', 'https://www.reddit.com/')) == 2
assert '<table>' in steps_for('1. First action\n2. Second action\n\nName | Value\n--- | ---\nA | B', 'https://www.reddit.com/')[1]['html']
assert len(steps_for('## Build\n1. One\n2. Two\n### Upgrade\n3. Three', 'https://www.reddit.com/')) == 1
assert len(steps_for('1. First action\n2. Second action\n## Boss\nDefeat the boss', 'https://www.reddit.com/', split_intro=True)) == 3
assert rendered('Cup\n  1. Place it\n  2. Defend it\nBrush\n  1. Collect it\n  2. Return it', 'https://www.reddit.com/').count('<ol>') == 2
assert '<ol start="2">' in rendered('2. Second action\n3. Third action', 'https://www.reddit.com/')
assert without_lyrics('Instructions\ncite1†LYRICS\n> Verse\n>\n\n## Next quest\nKeep this') == 'Instructions\n## Next quest\nKeep this'

community = []
gaps = []
for reference in references:
    for section in reference['sections']:
        if section.get('sourceOnly'):
            continue
        for title, text in topics_for(section):
            if len(plain(text).split()) < 12 or '[Section unfinished' in text or 'CHANGE ME' in text:
                gaps.append({'mapIds': reference['mapIds'], 'title': title, 'source': reference['url']})
                continue
            map_ids = reference['mapIds']
            if 'zombies chronicles' in title.lower() or 'monty' in title.lower() or 'samantha\'s lullaby' in title.lower():
                map_ids = [map_id for map_id in map_ids if map_id.startswith('bo3-')]
            if 'world at war version only' in text.lower():
                map_ids = [map_id for map_id in map_ids if map_id.startswith('waw-')]
            if not map_ids:
                continue
            topic_id = slug(reference['url'].split('/wiki/')[-1] + '-' + section['title'] + '-' + title)
            if any(guide['id'] == topic_id for guide in community):
                topic_id += '-additional'
            topic_category = category(title)
            if topic_category == 'side' and category(section['title']) == 'weapon':
                topic_category = 'weapon'
            if section['title'] in ['Into The Storm', 'Across The Depths', 'Beneath The Ice']:
                chapter_id = {'Into The Storm': 'wwii-into-the-storm', 'Across The Depths': 'wwii-across-the-depths', 'Beneath The Ice': 'wwii-beneath-the-ice'}[section['title']]
                map_ids = [*map_ids, chapter_id]
                title = section['title'] + ' — ' + title
            steps = steps_for(text, reference['url'], split_intro=topic_category == 'main')
            _, subsections = chunks(text)
            omitted = [name for name, body in subsections if not re.search(r'[A-Za-z]', plain(body)) or re.fullmatch(r'[\d.\s]*(?:TBD|TBA|TODO|WIP)[.\s]*', plain(body))]
            if re.search(r'\b(?:TBD|TBA|TODO|WIP)\b', text) and not omitted:
                gaps.append({'mapIds': map_ids, 'title': title, 'source': reference['url']})
                continue
            for name in omitted:
                gaps.append({'mapIds': map_ids, 'title': title + ' — ' + name, 'source': reference['url']})
            community.append({
                'id': topic_id, 'mapIds': map_ids, 'title': title,
                'category': topic_category, 'difficulty': 'Community guide',
                'players': 'See version requirements',
                'summary': f'Community instructions for {title}, with the documented locations, puzzle rules and completion conditions.',
                'requirements': ['Read the setup and player requirements in the quoted instructions before starting.', 'Shared source: follow the sections for your selected game version.' if len(reference['mapIds']) > 1 else 'Use the map setup, weapon and upgrade guides linked below when the quest calls for them.'],
                'reward': 'The weapon, upgrade, secret or quest outcome described in the instructions below.',
                'steps': steps, 'sourceOmissions': omitted,
                'sources': [{'title': 'r/CODZombies community map guide', 'url': reference['url']}],
                'checked': reference['fetched'], 'sourceQuote': reference['url'],
                'sharedSource': len(reference['mapIds']) > 1,
            })

assert all(guide['steps'] and guide['mapIds'] for guide in community)
assert len({guide['id'] for guide in community}) == len(community)
supplements = json.loads((root / 'data/guides-extra.json').read_text(encoding='utf-8'))
for guide in community:
    if not guide['sourceOmissions']:
        continue
    runtime_ids = {f"{map_id}-community-{guide['id']}" for map_id in guide['mapIds']}
    for supplement in supplements:
        if runtime_ids.intersection(supplement.get('relatedGuideIds', [])):
            guide['steps'].extend(dict(step, original=True) for step in supplement['steps'])
            guide['sources'].extend(supplement['sources'])
            guide['sourceOmissions'] = []
            guide['supplementNote'] = 'The omitted final boss chapter is completed with researched instructions from the additional credited sources.'
(root / 'data/guides-community.json').write_text(json.dumps(community, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
(root / 'data/source-gaps.json').write_text(json.dumps(gaps, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"Saved {len(community)} community topics, {sum(len(guide['steps']) for guide in community)} checklist sections; {len(gaps)} unfinished source topics kept out of walkthrough counts.")
