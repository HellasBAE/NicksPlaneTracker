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

// Runtime cache for API lookups: icao24 → { airline, aircraftType }
const apiCache = {};

/**
 * Look up aircraft details by ICAO24 hex code via hexdb.io.
 * Returns { airline, aircraftType } or null. Results are cached.
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
    const result = {
      airline: data.RegisteredOwners || data.OperatorFlagCode || null,
      aircraftType: data.Type || data.ICAOTypeCode || null,
    };
    apiCache[icao24] = result;
    return result;
  } catch {
    apiCache[icao24] = null;
    return null;
  }
}

/**
 * Get airline name from callsign prefix (static table).
 */
export function getAirline(callsign) {
  if (!callsign || callsign.length < 3) return null;
  const prefix = callsign.substring(0, 3).toUpperCase();
  return AIRLINES[prefix] || null;
}

/**
 * Get aircraft info (airline + type) via callsign prefix and icao24 API lookup.
 * Calls onResult({ airline, aircraftType }) when resolved.
 */
export function getAircraftInfoAsync(callsign, icao24, onResult) {
  // Check cache first
  if (icao24 in apiCache && apiCache[icao24]) {
    const cached = apiCache[icao24];
    const airline = getAirline(callsign) || cached.airline;
    onResult({ airline, aircraftType: cached.aircraftType });
    return;
  }

  // Fetch from API
  lookupByIcao24(icao24).then((result) => {
    const airline = getAirline(callsign) || result?.airline || null;
    const aircraftType = result?.aircraftType || null;
    onResult({ airline, aircraftType });
  });
}
