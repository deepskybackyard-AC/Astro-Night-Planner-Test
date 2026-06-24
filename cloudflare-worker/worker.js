// Astro Night Planner - AviationWeather METAR/TAF Proxy for Cloudflare Workers
// Deploy this worker, for example at https://weather-api.deepskyastrophoto.de
// Endpoints:
//   /flight?stations=EDDS,EDDM
//   /metar?stations=EDDS,EDDM
//   /taf?stations=EDDS,EDDM

const ALLOWED_ORIGINS = new Set([
  'https://planner.deepskyastrophoto.de',
  'https://deepskybackyard-ac.github.io',
  'http://localhost:5173',
  'http://localhost:8080'
]);
const AVIATION_BASE = 'https://aviationweather.gov/api/data';
const CACHE_TTL_SECONDS = 300;

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://planner.deepskyastrophoto.de';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
    'Content-Type': 'application/json; charset=utf-8'
  };
}
function json(data, status, origin) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: corsHeaders(origin) });
}
function normalizeStations(value) {
  const ids = String(value || '')
    .split(/[\s,;]+/)
    .map(s => s.trim().toUpperCase())
    .filter(Boolean);
  const unique = [...new Set(ids)].filter(id => /^[A-Z]{4}$/.test(id));
  return unique.slice(0, 30);
}
async function fetchAviation(kind, stations) {
  const url = `${AVIATION_BASE}/${kind}?ids=${encodeURIComponent(stations.join(','))}&format=json`;
  const request = new Request(url, { cf: { cacheTtl: CACHE_TTL_SECONDS, cacheEverything: true } });
  const cached = await caches.default.match(request);
  if (cached) return cached.clone();
  const response = await fetch(request, { headers: { 'User-Agent': 'AstroNightPlanner/1.1 weather proxy' } });
  const copy = new Response(response.body, response);
  if (response.ok || response.status === 204) await caches.default.put(request, copy.clone());
  return copy;
}
async function readJsonResponse(response) {
  if (response.status === 204) return [];
  const text = await response.text();
  if (!text.trim()) return [];
  return JSON.parse(text);
}
export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, origin);
    const url = new URL(request.url);
    const stations = normalizeStations(url.searchParams.get('stations') || url.searchParams.get('ids'));
    if (!stations.length) return json({ error: 'No valid stations supplied', example: '/flight?stations=EDDS,EDDM' }, 400, origin);
    try {
      if (url.pathname === '/metar') {
        const metarRes = await fetchAviation('metar', stations);
        return json({ stations, metars: await readJsonResponse(metarRes), fetchedAt: new Date().toISOString(), source: 'aviationweather.gov' }, metarRes.ok || metarRes.status === 204 ? 200 : metarRes.status, origin);
      }
      if (url.pathname === '/taf') {
        const tafRes = await fetchAviation('taf', stations);
        return json({ stations, tafs: await readJsonResponse(tafRes), fetchedAt: new Date().toISOString(), source: 'aviationweather.gov' }, tafRes.ok || tafRes.status === 204 ? 200 : tafRes.status, origin);
      }
      if (url.pathname === '/flight' || url.pathname === '/') {
        const [metarRes, tafRes] = await Promise.all([fetchAviation('metar', stations), fetchAviation('taf', stations)]);
        const status = (metarRes.ok || metarRes.status === 204) && (tafRes.ok || tafRes.status === 204) ? 200 : 502;
        return json({ stations, metars: await readJsonResponse(metarRes), tafs: await readJsonResponse(tafRes), fetchedAt: new Date().toISOString(), source: 'aviationweather.gov' }, status, origin);
      }
      return json({ error: 'Not found', endpoints: ['/flight', '/metar', '/taf'] }, 404, origin);
    } catch (error) {
      return json({ error: error && error.message ? error.message : String(error) }, 502, origin);
    }
  }
};
