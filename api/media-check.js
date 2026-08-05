const ALLOWED_HOSTS = new Set([
  'www.callofdutyzombies.com',
  'callofdutyzombies.com',
  'images.saymedia-content.com'
]);

module.exports = async function handler(req, res) {
  try {
    const raw = Array.isArray(req.query?.src) ? req.query.src[0] : req.query?.src;
    if (!raw) return res.status(400).json({ ok: false, error: 'Missing src' });
    const target = new URL(raw);
    if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
      return res.status(403).json({ ok: false, error: 'Media host not allowed' });
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
    const body = Buffer.from(await response.arrayBuffer());
    const signature = body.subarray(0, 8).toString('ascii');
    return res.status(200).json({
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type'),
      bytes: body.length,
      signature
    });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error.message });
  }
};
