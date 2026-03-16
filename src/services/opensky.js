/**
 * Fetch live plane data from the OpenSky Network API within a bounding box.
 * Optionally uses credentials for higher rate limits.
 * Returns an array of plane objects.
 */
export async function fetchPlanes(bbox, credentials) {
  const { south, west, north, east } = bbox;
  const url = `https://opensky-network.org/api/states/all?lamin=${south}&lomin=${west}&lamax=${north}&lomax=${east}`;

  const headers = {};
  if (credentials?.username && credentials?.password) {
    headers['Authorization'] = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
  }

  const res = await fetch(url, { headers });

  if (res.status === 429) throw new Error('RATE_LIMITED');
  if (res.status === 401) throw new Error('INVALID_CREDENTIALS');
  if (!res.ok) throw new Error(`OpenSky API error: ${res.status}`);

  const data = await res.json();

  if (!data.states) return [];

  return data.states.map((s) => ({
    icao24: s[0],
    callsign: (s[1] || '').trim(),
    country: s[2],
    lng: s[5],
    lat: s[6],
    altitudeM: s[7],
    onGround: s[8],
    velocityMs: s[9],
    heading: s[10],
    verticalRate: s[11],
    altitudeFt: s[7] != null ? Math.round(s[7] * 3.28084) : null,
    speedKnots: s[9] != null ? Math.round(s[9] * 1.94384) : null,
  })).filter((p) => p.lat != null && p.lng != null);
}
