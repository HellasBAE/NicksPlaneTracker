/**
 * ICAO airline designator → airline name lookup.
 * Uses a static table for common airlines + caches results from
 * the hexdb.io API for any prefix not in the table.
 */
const AIRLINES = {
  AAL: 'American Airlines',
  AAR: 'Asiana Airlines',
  ACA: 'Air Canada',
  AEE: 'Aegean Airlines',
  AFR: 'Air France',
  AIC: 'Air India',
  AIZ: 'Arkia Israeli Airlines',
  AJT: 'Amerijet International',
  AMX: 'Aeromexico',
  ANA: 'All Nippon Airways',
  ANZ: 'Air New Zealand',
  ASA: 'Alaska Airlines',
  AUA: 'Austrian Airlines',
  AUI: 'Ukraine Intl Airlines',
  AZA: 'ITA Airways',
  BAW: 'British Airways',
  BEL: 'Brussels Airlines',
  CAL: 'China Airlines',
  CCA: 'Air China',
  CES: 'China Eastern',
  CFG: 'Condor',
  CLX: 'Cargolux',
  CPA: 'Cathay Pacific',
  CSN: 'China Southern',
  CTN: 'Croatia Airlines',
  CYP: 'Cyprus Airways',
  DAL: 'Delta Air Lines',
  DLH: 'Lufthansa',
  EIN: 'Aer Lingus',
  EJU: 'easyJet Europe',
  ELY: 'El Al',
  ETD: 'Etihad Airways',
  ETH: 'Ethiopian Airlines',
  EVA: 'EVA Air',
  EWG: 'Eurowings',
  EZY: 'easyJet',
  FDX: 'FedEx Express',
  FIN: 'Finnair',
  GEC: 'Lufthansa Cargo',
  GIA: 'Garuda Indonesia',
  GTI: 'Atlas Air',
  HAL: 'Hawaiian Airlines',
  HVN: 'Vietnam Airlines',
  IBE: 'Iberia',
  ICE: 'Icelandair',
  IGO: 'IndiGo',
  IRA: 'Iran Air',
  JAL: 'Japan Airlines',
  JBU: 'JetBlue Airways',
  JST: 'Jetstar Airways',
  KAL: 'Korean Air',
  KLM: 'KLM Royal Dutch',
  KQA: 'Kenya Airways',
  LAN: 'LATAM Airlines',
  LOT: 'LOT Polish Airlines',
  MAS: 'Malaysia Airlines',
  MSR: 'EgyptAir',
  NAX: 'Norwegian Air',
  NKS: 'Spirit Airlines',
  OAL: 'Olympic Air',
  PAL: 'Philippine Airlines',
  PGT: 'Pegasus Airlines',
  PIA: 'Pakistan Intl Airlines',
  QFA: 'Qantas',
  QTR: 'Qatar Airways',
  RAM: 'Royal Air Maroc',
  RJA: 'Royal Jordanian',
  ROT: 'TAROM',
  RYR: 'Ryanair',
  SAS: 'Scandinavian Airlines',
  SAA: 'South African Airways',
  SIA: 'Singapore Airlines',
  SKW: 'SkyWest Airlines',
  SWA: 'Southwest Airlines',
  SWR: 'Swiss Intl Air Lines',
  TAP: 'TAP Air Portugal',
  THA: 'Thai Airways',
  THY: 'Turkish Airlines',
  TUI: 'TUI fly',
  TVF: 'Transavia France',
  UAE: 'Emirates',
  UAL: 'United Airlines',
  UPS: 'UPS Airlines',
  UTA: 'UTair Aviation',
  VIR: 'Virgin Atlantic',
  VOZ: 'Virgin Australia',
  VLG: 'Vueling Airlines',
  WZZ: 'Wizz Air',
};

// Runtime cache for API lookups (prefix → name or null)
const apiCache = {};

/**
 * Look up airline by ICAO24 hex code via hexdb.io.
 * Returns airline name or null. Results are cached in memory.
 */
async function lookupByIcao24(icao24) {
  if (icao24 in apiCache) return apiCache[icao24];

  try {
    const res = await fetch(`https://hexdb.io/api/v1/aircraft/${icao24}`);
    if (!res.ok) {
      apiCache[icao24] = null;
      return null;
    }
    const data = await res.json();
    const name = data.RegisteredOwners || data.OperatorFlagCode || null;
    apiCache[icao24] = name;
    return name;
  } catch {
    apiCache[icao24] = null;
    return null;
  }
}

/**
 * Get airline name - first tries callsign prefix, then falls back to
 * ICAO24 hex lookup. Returns { name, pending } where pending means
 * an async lookup is in progress.
 */
export function getAirline(callsign) {
  if (!callsign || callsign.length < 3) return null;
  const prefix = callsign.substring(0, 3).toUpperCase();
  return AIRLINES[prefix] || null;
}

/**
 * Get airline info, trying callsign first then icao24 hex API lookup.
 * Calls onResult(name) when the API lookup resolves.
 */
export function getAirlineAsync(callsign, icao24, onResult) {
  // Try static lookup first
  const staticResult = getAirline(callsign);
  if (staticResult) {
    onResult(staticResult);
    return;
  }

  // Try cached API result
  if (icao24 in apiCache) {
    onResult(apiCache[icao24]);
    return;
  }

  // Fetch from API
  lookupByIcao24(icao24).then(onResult);
}
