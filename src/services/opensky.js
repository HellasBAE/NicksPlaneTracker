/**
 * Fetch live plane data from the OpenSky Network API within a bounding box.
 * Returns an array of plane objects.
 */
export async function fetchPlanes(bbox) {
  const { south, west, north, east } = bbox;
  const url = `https://opensky-network.org/api/states/all?lamin=${south}&lomin=${west}&lamax=${north}&lomax=${east}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error(`OpenSky API error: ${res.status}`);

  const data = await res.json();

  if (!data.states) return [];

  return data.states.map((s) => ({
    icao24: s[0],
    callsign: (s[1] || '').trim(),
    country: s[2],
    lng: s[5],
    lat: s[6],
    altitudeM: s[7],       // geometric altitude in meters
    onGround: s[8],
    velocityMs: s[9],      // m/s
    heading: s[10],         // degrees from north
    verticalRate: s[11],
    altitudeFt: s[7] != null ? Math.round(s[7] * 3.28084) : null,
    speedKnots: s[9] != null ? Math.round(s[9] * 1.94384) : null,
  })).filter((p) => p.lat != null && p.lng != null);
}
