/**
 * Aircraft silhouette SVGs by category, all pointing north (up).
 * Each is a function(color, size) → SVG string.
 */

// Wide-body: B747, A380, B777, A330, A340, B787, A350, etc.
function widebody(color, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <g>
    <path d="M32 4 C33.5 4 35 7 35 12 L35 22 L34 38 L32 54 L30 38 L29 22 L29 12 C29 7 30.5 4 32 4Z"
      fill="${color}" stroke="#fff" stroke-width="0.8"/>
    <path d="M29 22 L6 31 L6 33 L29.5 27Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M35 22 L58 31 L58 33 L34.5 27Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M30.5 38 L20 43 L20 44.5 L30.8 40Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M33.5 38 L44 43 L44 44.5 L33.2 40Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M32 42 L32 54 L30.5 48Z" fill="${color}" opacity="0.6"/>
    <path d="M32 42 L32 54 L33.5 48Z" fill="#fff" opacity="0.12"/>
    <ellipse cx="32" cy="10" rx="1.8" ry="3.5" fill="#fff" opacity="0.2"/>
    <line x1="10" y1="32" x2="14" y2="31.5" stroke="${color}" stroke-width="1.5"/>
    <line x1="54" y1="32" x2="50" y2="31.5" stroke="${color}" stroke-width="1.5"/>
    <line x1="16" y1="31.5" x2="20" y2="31" stroke="${color}" stroke-width="1.2"/>
    <line x1="48" y1="31.5" x2="44" y2="31" stroke="${color}" stroke-width="1.2"/>
  </g>
</svg>`;
}

// Narrow-body: A320, B737, A321, B757, etc.
function narrowbody(color, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <g>
    <path d="M32 5 C33.2 5 34.5 8 34.5 12 L34.5 22 L33.5 38 L32 52 L30.5 38 L29.5 22 L29.5 12 C29.5 8 30.8 5 32 5Z"
      fill="${color}" stroke="#fff" stroke-width="0.8"/>
    <path d="M29.5 23 L9 32 L9 33.8 L30 27Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M34.5 23 L55 32 L55 33.8 L34 27Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M31 39 L22 43 L22 44.2 L31.2 40.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M33 39 L42 43 L42 44.2 L32.8 40.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M32 40 L32 52 L30.8 47Z" fill="${color}" opacity="0.6"/>
    <path d="M32 40 L32 52 L33.2 47Z" fill="#fff" opacity="0.12"/>
    <ellipse cx="32" cy="10" rx="1.5" ry="3" fill="#fff" opacity="0.2"/>
    <line x1="14" y1="32.5" x2="18" y2="32" stroke="${color}" stroke-width="1.3"/>
    <line x1="50" y1="32.5" x2="46" y2="32" stroke="${color}" stroke-width="1.3"/>
  </g>
</svg>`;
}

// Regional jet: E170, E190, CRJ, ERJ, etc.
function regionaljet(color, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <g>
    <path d="M32 6 C33 6 34 9 34 13 L34 24 L33 39 L32 52 L31 39 L30 24 L30 13 C30 9 31 6 32 6Z"
      fill="${color}" stroke="#fff" stroke-width="0.8"/>
    <path d="M30 25 L13 33 L13 34.5 L30.5 28Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M34 25 L51 33 L51 34.5 L33.5 28Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M31.2 40 L24 43.5 L24 44.5 L31.4 41.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M32.8 40 L40 43.5 L40 44.5 L32.6 41.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M32 41 L32 52 L31 47Z" fill="${color}" opacity="0.6"/>
    <path d="M32 41 L32 52 L33 47Z" fill="#fff" opacity="0.12"/>
    <ellipse cx="32" cy="11" rx="1.2" ry="2.5" fill="#fff" opacity="0.2"/>
  </g>
</svg>`;
}

// Turboprop: ATR, DHC-8, Saab, Beech 1900, etc.
function turboprop(color, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <g>
    <path d="M32 7 C33 7 34 10 34 14 L34 24 L33 38 L32 50 L31 38 L30 24 L30 14 C30 10 31 7 32 7Z"
      fill="${color}" stroke="#fff" stroke-width="0.8"/>
    <path d="M30 21 L10 28 L10 29.5 L30 24Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M34 21 L54 28 L54 29.5 L34 24Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M31 39 L23 42.5 L23 43.5 L31.2 40.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M33 39 L41 42.5 L41 43.5 L32.8 40.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M32 40 L32 50 L31 46Z" fill="${color}" opacity="0.6"/>
    <path d="M32 40 L32 50 L33 46Z" fill="#fff" opacity="0.12"/>
    <ellipse cx="32" cy="11.5" rx="1.2" ry="2" fill="#fff" opacity="0.2"/>
    <circle cx="16" cy="28.5" r="2.5" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.5"/>
    <circle cx="48" cy="28.5" r="2.5" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.5"/>
  </g>
</svg>`;
}

// Small prop / GA: C172, PA28, SR22, etc.
function smallprop(color, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <g>
    <path d="M32 10 C33 10 33.5 13 33.5 16 L33.5 26 L33 38 L32 50 L31 38 L30.5 26 L30.5 16 C30.5 13 31 10 32 10Z"
      fill="${color}" stroke="#fff" stroke-width="0.8"/>
    <path d="M30.5 23 L12 29 L12 30.5 L31 26Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M33.5 23 L52 29 L52 30.5 L33 26Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M31.2 39 L24 42 L24 43 L31.4 40.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M32.8 39 L40 42 L40 43 L32.6 40.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M32 40 L32 50 L31.2 46Z" fill="${color}" opacity="0.6"/>
    <path d="M32 40 L32 50 L32.8 46Z" fill="#fff" opacity="0.12"/>
    <ellipse cx="32" cy="13" rx="1" ry="1.5" fill="#fff" opacity="0.2"/>
    <circle cx="32" cy="10" r="2" fill="none" stroke="${color}" stroke-width="0.7" opacity="0.5"/>
  </g>
</svg>`;
}

// Helicopter
function helicopter(color, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <g>
    <path d="M32 16 C34 16 35 19 35 23 L35 30 L34 40 L32 48 L30 40 L29 30 L29 23 C29 19 30 16 32 16Z"
      fill="${color}" stroke="#fff" stroke-width="0.8"/>
    <line x1="32" y1="16" x2="32" y2="8" stroke="${color}" stroke-width="1.2"/>
    <line x1="18" y1="8" x2="46" y2="8" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M34 40 L42 38 L42 36Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M42 37 L50 35" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="28" y1="45" x2="36" y2="45" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="27" y1="45" x2="26" y2="48" stroke="${color}" stroke-width="1" stroke-linecap="round"/>
    <line x1="37" y1="45" x2="38" y2="48" stroke="${color}" stroke-width="1" stroke-linecap="round"/>
    <ellipse cx="32" cy="20" rx="1.5" ry="2.5" fill="#fff" opacity="0.2"/>
  </g>
</svg>`;
}

// Default / generic jet (fallback)
function generic(color, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <g>
    <path d="M32 6 C33.5 6 35 9 35 14 L35 24 L34 38 L32 52 L30 38 L29 24 L29 14 C29 9 30.5 6 32 6Z"
      fill="${color}" stroke="#fff" stroke-width="0.8"/>
    <path d="M29 24 L8 32 L8 33.8 L29.5 27Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M35 24 L56 32 L56 33.8 L34.5 27Z" fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <path d="M30.5 39 L22 43 L22 44.2 L30.8 40.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M33.5 39 L42 43 L42 44.2 L33.2 40.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M32 40 L32 52 L30.5 47Z" fill="${color}" opacity="0.6"/>
    <path d="M32 40 L32 52 L33.5 47Z" fill="#fff" opacity="0.12"/>
    <ellipse cx="32" cy="11" rx="1.5" ry="3" fill="#fff" opacity="0.2"/>
  </g>
</svg>`;
}

/**
 * Map ICAO type codes to silhouette categories.
 */
const TYPE_MAP = {
  // Wide-body
  A332: 'widebody', A333: 'widebody', A338: 'widebody', A339: 'widebody',
  A342: 'widebody', A343: 'widebody', A345: 'widebody', A346: 'widebody',
  A359: 'widebody', A35K: 'widebody',
  A380: 'widebody', A388: 'widebody',
  B741: 'widebody', B742: 'widebody', B743: 'widebody', B744: 'widebody', B748: 'widebody',
  B762: 'widebody', B763: 'widebody', B764: 'widebody',
  B772: 'widebody', B773: 'widebody', B77L: 'widebody', B77W: 'widebody', B778: 'widebody', B779: 'widebody',
  B788: 'widebody', B789: 'widebody', B78X: 'widebody',
  DC10: 'widebody', MD11: 'widebody',
  A306: 'widebody', A30B: 'widebody', A310: 'widebody',
  IL96: 'widebody', IL86: 'widebody',

  // Narrow-body
  A318: 'narrowbody', A319: 'narrowbody', A320: 'narrowbody', A321: 'narrowbody',
  A19N: 'narrowbody', A20N: 'narrowbody', A21N: 'narrowbody',
  B731: 'narrowbody', B732: 'narrowbody', B733: 'narrowbody', B734: 'narrowbody',
  B735: 'narrowbody', B736: 'narrowbody', B737: 'narrowbody', B738: 'narrowbody',
  B739: 'narrowbody', B37M: 'narrowbody', B38M: 'narrowbody', B39M: 'narrowbody',
  B3XM: 'narrowbody',
  B752: 'narrowbody', B753: 'narrowbody',
  MD80: 'narrowbody', MD81: 'narrowbody', MD82: 'narrowbody', MD83: 'narrowbody',
  MD87: 'narrowbody', MD88: 'narrowbody', MD90: 'narrowbody',
  B712: 'narrowbody', B717: 'narrowbody',
  C919: 'narrowbody',

  // Regional jets
  E170: 'regionaljet', E175: 'regionaljet', E190: 'regionaljet', E195: 'regionaljet',
  E75S: 'regionaljet', E75L: 'regionaljet', E290: 'regionaljet', E295: 'regionaljet',
  CRJ1: 'regionaljet', CRJ2: 'regionaljet', CRJ7: 'regionaljet', CRJ9: 'regionaljet', CRJX: 'regionaljet',
  E135: 'regionaljet', E145: 'regionaljet', E35L: 'regionaljet',
  RJ85: 'regionaljet', RJ1H: 'regionaljet', B461: 'regionaljet', B462: 'regionaljet', B463: 'regionaljet',
  F70: 'regionaljet', F100: 'regionaljet',

  // Turboprops
  AT43: 'turboprop', AT45: 'turboprop', AT46: 'turboprop',
  AT72: 'turboprop', AT73: 'turboprop', AT75: 'turboprop', AT76: 'turboprop',
  ATR: 'turboprop',
  DH8A: 'turboprop', DH8B: 'turboprop', DH8C: 'turboprop', DH8D: 'turboprop',
  DHC6: 'turboprop', DHC7: 'turboprop',
  SF34: 'turboprop', SB20: 'turboprop',
  JS41: 'turboprop', JS32: 'turboprop',
  B190: 'turboprop', BE20: 'turboprop', BE30: 'turboprop', BE99: 'turboprop',
  SW4: 'turboprop', SW3: 'turboprop',
  AN24: 'turboprop', AN26: 'turboprop', AN12: 'turboprop',
  L410: 'turboprop', C208: 'turboprop', PC12: 'turboprop',

  // Small prop / GA
  C150: 'smallprop', C152: 'smallprop', C172: 'smallprop', C182: 'smallprop',
  C206: 'smallprop', C210: 'smallprop', C310: 'smallprop', C340: 'smallprop',
  C402: 'smallprop', C414: 'smallprop', C421: 'smallprop',
  PA18: 'smallprop', PA28: 'smallprop', PA32: 'smallprop', PA34: 'smallprop',
  PA44: 'smallprop', PA46: 'smallprop',
  SR20: 'smallprop', SR22: 'smallprop',
  DA40: 'smallprop', DA42: 'smallprop', DA62: 'smallprop',
  P28A: 'smallprop', P28B: 'smallprop', P28R: 'smallprop',
  M20P: 'smallprop', M20T: 'smallprop', BE33: 'smallprop', BE35: 'smallprop', BE36: 'smallprop',
  AA5: 'smallprop', P46T: 'smallprop', TBM7: 'smallprop', TBM8: 'smallprop', TBM9: 'smallprop',

  // Helicopters
  R22: 'helicopter', R44: 'helicopter', R66: 'helicopter',
  EC20: 'helicopter', EC25: 'helicopter', EC30: 'helicopter', EC35: 'helicopter',
  EC45: 'helicopter', EC55: 'helicopter', EC75: 'helicopter',
  A109: 'helicopter', A119: 'helicopter', A139: 'helicopter', A149: 'helicopter', A169: 'helicopter',
  B06: 'helicopter', B105: 'helicopter', B212: 'helicopter', B222: 'helicopter',
  B407: 'helicopter', B412: 'helicopter', B429: 'helicopter',
  S76: 'helicopter', S92: 'helicopter',
  AS32: 'helicopter', AS50: 'helicopter', AS55: 'helicopter', AS65: 'helicopter',
  H500: 'helicopter', H60: 'helicopter', UH1: 'helicopter',
  H125: 'helicopter', H130: 'helicopter', H135: 'helicopter', H145: 'helicopter',
  H155: 'helicopter', H160: 'helicopter', H175: 'helicopter', H215: 'helicopter', H225: 'helicopter',
};

const RENDERERS = {
  widebody,
  narrowbody,
  regionaljet,
  turboprop,
  smallprop,
  helicopter,
  generic,
};

/**
 * Get the appropriate aircraft silhouette SVG for a given ICAO type code.
 */
export function getPlaneSvg(icaoType, color, size) {
  const category = (icaoType && TYPE_MAP[icaoType.toUpperCase()]) || 'generic';
  return RENDERERS[category](color, size);
}
