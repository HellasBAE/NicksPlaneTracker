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

  return parseStates(data);
}

/**
 * Fetch a single plane by its ICAO24 hex code.
 * Returns the plane object or null if not found / not airborne.
 */
export async function fetchPlaneByIcao24(icao24, credentials) {
  const url = `https://opensky-network.org/api/states/all?icao24=${icao24.toLowerCase()}`;

  const headers = {};
  if (credentials?.username && credentials?.password) {
    headers['Authorization'] = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
  }

  const res = await fetch(url, { headers });

  if (res.status === 429) throw new Error('RATE_LIMITED');
  if (!res.ok) return null;

  const data = await res.json();
  const planes = parseStates(data);
  return planes.length > 0 ? planes[0] : null;
}

/**
 * Fetch a plane by its registration (tail number).
 * Converts US N-numbers to ICAO24 hex, then looks up.
 * Falls back to scanning all states if conversion fails.
 */
export async function fetchPlaneByRegistration(registration, credentials) {
  // Try converting N-number to ICAO hex
  const hex = nNumberToHex(registration);
  if (hex) {
    const plane = await fetchPlaneByIcao24(hex, credentials);
    if (plane) return plane;
  }
  return null;
}

/**
 * Convert a US N-number registration to ICAO24 hex code.
 * US ICAO addresses range from A00001 to AFFFFF.
 * Algorithm based on FAA N-number to hex mapping.
 */
function nNumberToHex(nNumber) {
  if (!nNumber || !nNumber.startsWith('N')) return null;
  const suffix = nNumber.substring(1).toUpperCase();

  // Character sets for N-number encoding
  const digits = '0123456789';
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I or O

  // Base offset for US registrations
  const base = 0xA00001;

  let offset = 0;
  const chars = suffix.split('');

  if (chars.length < 1 || chars.length > 5) return null;
  if (!digits.includes(chars[0])) return null;

  // First digit (1-9) → each digit block = 101711 addresses
  const d1 = parseInt(chars[0]);
  if (d1 < 1 || d1 > 9) return null;
  offset += (d1 - 1) * 101711;

  if (chars.length === 1) {
    return (base + offset).toString(16).padStart(6, '0');
  }

  // Second char: digit or letter
  if (digits.includes(chars[1])) {
    offset += parseInt(chars[1]) * 10111 + 601;
  } else if (letters.includes(chars[1])) {
    offset += letters.indexOf(chars[1]) * 25 + 1;
    // Two-letter suffix (e.g., N1KE)
    if (chars.length === 2) {
      return (base + offset).toString(16).padStart(6, '0');
    }
    if (chars.length === 3 && letters.includes(chars[2])) {
      offset += letters.indexOf(chars[2]) + 1;
      return (base + offset).toString(16).padStart(6, '0');
    }
    return null;
  } else {
    return null;
  }

  if (chars.length === 2) {
    return (base + offset).toString(16).padStart(6, '0');
  }

  // Third char
  if (digits.includes(chars[2])) {
    offset += parseInt(chars[2]) * 1011 + 601;
  } else if (letters.includes(chars[2])) {
    offset += letters.indexOf(chars[2]) * 25 + 1;
    if (chars.length === 3) {
      return (base + offset).toString(16).padStart(6, '0');
    }
    if (chars.length === 4 && letters.includes(chars[3])) {
      offset += letters.indexOf(chars[3]) + 1;
      return (base + offset).toString(16).padStart(6, '0');
    }
    return null;
  } else {
    return null;
  }

  if (chars.length === 3) {
    return (base + offset).toString(16).padStart(6, '0');
  }

  // Fourth char
  if (digits.includes(chars[3])) {
    offset += parseInt(chars[3]) * 101 + 601;
  } else if (letters.includes(chars[3])) {
    offset += letters.indexOf(chars[3]) * 25 + 1;
    if (chars.length === 4) {
      return (base + offset).toString(16).padStart(6, '0');
    }
    if (chars.length === 5 && letters.includes(chars[4])) {
      offset += letters.indexOf(chars[4]) + 1;
      return (base + offset).toString(16).padStart(6, '0');
    }
    return null;
  } else {
    return null;
  }

  if (chars.length === 4) {
    return (base + offset).toString(16).padStart(6, '0');
  }

  // Fifth char
  if (digits.includes(chars[4])) {
    offset += parseInt(chars[4]) * 10 + 601;
    return (base + offset).toString(16).padStart(6, '0');
  } else if (letters.includes(chars[4])) {
    offset += letters.indexOf(chars[4]) + 1;
    return (base + offset).toString(16).padStart(6, '0');
  }

  return null;
}

function parseStates(data) {
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
