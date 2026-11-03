// Cloudflare Pages Function — GET /api/social
// Reads Antara's latest Instagram posts/reels and stories (official Instagram API)
// and her latest YouTube videos (public feed). The Instagram token is a secret
// stored in Cloudflare (IG_TOKEN), never in the website files.
const YT_CHANNEL = 'UCy6GKtZrTXYqjnDfB-NDBrw';
const G = 'https://graph.instagram.com';
const TTL = 600; // seconds between refreshes (10 minutes)

export async function onRequestGet({ env, request, waitUntil }) {
  const kv = env.SOCIAL || null;
  if (kv) {
    const hit = await kv.get('feed', 'json');
    if (hit && Date.now() - hit.t < TTL * 1000) return reply(hit.d);
  } else {
    const c = await caches.default.match(cacheKey(request));
    if (c) return c;
  }
  const out = { updated: new Date().toISOString(), ig: null, igStatus: 'not-connected', yt: [] };
  const [ig, yt] = await Promise.allSettled([instagram(env, kv), youtube()]);
  if (ig.status === 'fulfilled' && ig.value) { out.ig = ig.value; out.igStatus = 'live'; }
  else if (ig.status === 'rejected') { out.igStatus = 'error'; out.igError = String(ig.reason && ig.reason.message || ig.reason).slice(0, 160); }
  if (yt.status === 'fulfilled') out.yt = yt.value;
  // If Instagram failed this time, keep showing the last good Instagram data.
  if (!out.ig && kv) { const last = await kv.get('feed', 'json'); if (last && last.d && last.d.ig) out.ig = last.d.ig; }
  const res = reply(out);
  if (kv) waitUntil(kv.put('feed', JSON.stringify({ t: Date.now(), d: out })));
  else waitUntil(caches.default.put(cacheKey(request), res.clone()));
  return res;
}

function reply(d) {
  return new Response(JSON.stringify(d), { headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': `public, max-age=120, s-maxage=${TTL}`,
    'x-content-type-options': 'nosniff' } });
}
function cacheKey(request) { const u = new URL(request.url); return new Request(u.origin + '/api/social'); }

async function instagram(env, kv) {
  const seed = env.IG_TOKEN;
  if (!seed) return null;
  let token = seed;
  if (kv) {
    // Use the auto-renewed token, unless a new token was pasted into Cloudflare since.
    const [saved, savedSeed] = await Promise.all([kv.get('ig_token'), kv.get('ig_seed')]);
    if (saved && savedSeed === seed) token = saved;
    else await kv.put('ig_seed', seed);
    // Long-lived tokens last 60 days; renew weekly so it never expires.
    const last = +(await kv.get('ig_refreshed') || 0);
    if (Date.now() - last > 6 * 864e5) {
      try {
        const r = await fetch(`${G}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
        const j = await r.json();
        if (j.access_token) { token = j.access_token; await kv.put('ig_token', token); }
        await kv.put('ig_refreshed', String(Date.now()));
      } catch (e) { /* try again next time */ }
    }
  }
  const t = encodeURIComponent(token);
  const F = 'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count';
  const mr = await fetch(`${G}/me/media?fields=${F}&limit=30&access_token=${t}`);
  const m = await mr.json();
  if (m.error) throw new Error(m.error.message || 'Instagram error');
  const items = (m.data || []).map(x => {
    const code = ((x.permalink || '').match(/\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/) || [])[1] || '';
    const video = x.media_type === 'VIDEO';
    return { code, kind: video || x.media_product_type === 'REELS' ? 'reel' : 'photo',
      cap: (x.caption || '').slice(0, 1200), date: x.timestamp,
      likes: x.like_count || 0, comments: x.comments_count || 0,
      thumb: video ? (x.thumbnail_url || '') : (x.media_url || ''), url: x.permalink };
  }).filter(x => x.code);
  let stories = [];
  try {
    const sr = await fetch(`${G}/me/stories?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${t}`);
    const s = await sr.json();
    stories = (s.data || []).filter(x => x.media_url).map(x => ({ type: x.media_type, src: x.media_url,
      thumb: x.thumbnail_url || (x.media_type === 'VIDEO' ? '' : x.media_url), url: x.permalink, date: x.timestamp }))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  } catch (e) { /* stories are optional */ }
  return { items, stories };
}

async function youtube() {
  const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL}`, { cf: { cacheTtl: 900 } });
  if (!r.ok) return [];
  const xml = await r.text();
  const pick = (s, re) => ((s.match(re) || [])[1] || '').trim();
  const unesc = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return xml.split('<entry>').slice(1, 9).map(e => {
    const id = pick(e, /<yt:videoId>([^<]+)/);
    return { id, title: unesc(pick(e, /<title>([^<]*)/)), date: pick(e, /<published>([^<]+)/),
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
  }).filter(v => v.id);
}
