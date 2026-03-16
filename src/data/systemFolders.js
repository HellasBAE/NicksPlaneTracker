/**
 * System folders and their seeded planes.
 * System folders cannot be renamed or deleted by the user.
 */

export const SYSTEM_FOLDER_PREFIX = 'sys_';

export const SYSTEM_FOLDERS = {
  sys_billionaires: {
    id: 'sys_billionaires',
    name: 'BILLIONAIRES',
    system: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
};

/**
 * Seeded tracked planes for system folders.
 * Keyed by a stable ID (registration-based since icao24 may not be known).
 * The `registration` field is used to locate these planes via OpenSky.
 */
export const SEEDED_PLANES = {
  // Bill Gates
  'seed_N887WM': {
    icao24: 'seed_N887WM',
    callsign: '',
    aircraftType: 'Gulfstream G650ER',
    registration: 'N887WM',
    airline: 'Private (Mente LLC)',
    notes: 'Microsoft (co-founder). Often linked to family initials — WM for William/Mary. November eight eight seven Whiskey Mike.',
    customName: 'Bill Gates',
    tags: [],
    folders: ['sys_billionaires'],
    trackedAt: '2024-01-01T00:00:00.000Z',
    system: true,
  },
  'seed_N194WM': {
    icao24: 'seed_N194WM',
    callsign: '',
    aircraftType: 'Gulfstream G650ER',
    registration: 'N194WM',
    airline: 'Private (TVPX Aircraft Solutions)',
    notes: 'Microsoft (co-founder). Second G650ER. 194 refers to January 1994 marriage date.',
    customName: 'Bill Gates (#2)',
    tags: [],
    folders: ['sys_billionaires'],
    trackedAt: '2024-01-01T00:00:00.000Z',
    system: true,
  },

  // Elon Musk
  'seed_N628TS': {
    icao24: 'a835af',
    callsign: '',
    aircraftType: 'Gulfstream G650ER',
    registration: 'N628TS',
    airline: 'Private (Falcon Landing LLC)',
    notes: 'Tesla / SpaceX (CEO). November six two eight Tango Sierra. Primary jet.',
    customName: 'Elon Musk',
    tags: [],
    folders: ['sys_billionaires'],
    trackedAt: '2024-01-01T00:00:00.000Z',
    system: true,
  },
  'seed_N272BG': {
    icao24: 'seed_N272BG',
    callsign: '',
    aircraftType: 'Gulfstream G550',
    registration: 'N272BG',
    airline: 'Private',
    notes: 'Tesla / SpaceX (CEO). Older jet in fleet.',
    customName: 'Elon Musk (older)',
    tags: [],
    folders: ['sys_billionaires'],
    trackedAt: '2024-01-01T00:00:00.000Z',
    system: true,
  },

  // Jeff Bezos
  'seed_N758PB': {
    icao24: 'seed_N758PB',
    callsign: '',
    aircraftType: 'Gulfstream G650ER',
    registration: 'N758PB',
    airline: 'Private (Poplar Glen LLC)',
    notes: 'Amazon (founder). November seven five eight Papa Bravo.',
    customName: 'Jeff Bezos',
    tags: [],
    folders: ['sys_billionaires'],
    trackedAt: '2024-01-01T00:00:00.000Z',
    system: true,
  },
  'seed_N11AF': {
    icao24: 'seed_N11AF',
    callsign: '',
    aircraftType: 'Gulfstream G700',
    registration: 'N11AF',
    airline: 'Private',
    notes: 'Amazon (founder). Newer G700.',
    customName: 'Jeff Bezos (G700)',
    tags: [],
    folders: ['sys_billionaires'],
    trackedAt: '2024-01-01T00:00:00.000Z',
    system: true,
  },

  // Michael Jordan
  'seed_N236MJ': {
    icao24: 'seed_N236MJ',
    callsign: '',
    aircraftType: 'Gulfstream G650ER',
    registration: 'N236MJ',
    airline: 'Private',
    notes: 'Nike / Charlotte Hornets (billionaire via business). November two three six Mike Juliet. #23 jersey + 6 championships + MJ initials.',
    customName: 'Michael Jordan',
    tags: [],
    folders: ['sys_billionaires'],
    trackedAt: '2024-01-01T00:00:00.000Z',
    system: true,
  },

  // Phil Knight
  'seed_N1KE': {
    icao24: 'seed_N1KE',
    callsign: '',
    aircraftType: 'Gulfstream G650',
    registration: 'N1KE',
    airline: 'Private (Hum-Air Too LLC)',
    notes: 'Nike (co-founder). November one Kilo Echo. Vanity registration referencing "Nike" brand.',
    customName: 'Phil Knight',
    tags: [],
    folders: ['sys_billionaires'],
    trackedAt: '2024-01-01T00:00:00.000Z',
    system: true,
  },
};
