const ALLOWED_HOSTS = new Set([
  'www.callofdutyzombies.com',
  'callofdutyzombies.com',
  'images.saymedia-content.com'
]);

module.exports = async function handler(req, res) {
  try {
    const raw = Array.isArray(req.query?.src) ? req.query.src[0] : req.query?.src;
    if (!raw) return res.status(400).send('Missing src');

    const target = new URL(raw);
    if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
      return res.status(403).send('Media host not allowed');
    }

    const response = await fetch(target, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeadDropGuide/1.0)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': target.hostname.includes('callofdutyzombies.com')
          ? 'https://www.callofdutyzombies.com/'
          : 'https://discover.hubpages.com/'
      }
    });

    if (!response.ok) return res.status(response.status).send('Upstream media unavailable');

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      return res.status(415).send('Unsupported media type');
    }

    const body = Buffer.from(await response.arrayBuffer());
    if (body.length > 12 * 1024 * 1024) return res.status(413).send('Media too large');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=2592000');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(body);
  } catch (error) {
    console.error('media proxy error', error);
    return res.status(502).send('Media fetch failed');
  }
};
