/**
 * Fetch a photo for an aircraft. Tries in order:
 * 1. Planespotters.net by registration (exact aircraft)
 * 2. Wikipedia by aircraft type (generic photo of that type)
 */

const photoCache = {};

// Map common ICAO type codes to Wikipedia article titles
const WIKI_ARTICLES = {
  // Wide-body
  A332: 'Airbus_A330', A333: 'Airbus_A330', A338: 'Airbus_A330neo', A339: 'Airbus_A330neo',
  A342: 'Airbus_A340', A343: 'Airbus_A340', A345: 'Airbus_A340', A346: 'Airbus_A340',
  A359: 'Airbus_A350', A35K: 'Airbus_A350',
  A380: 'Airbus_A380', A388: 'Airbus_A380',
  B741: 'Boeing_747', B742: 'Boeing_747', B743: 'Boeing_747', B744: 'Boeing_747', B748: 'Boeing_747-8',
  B762: 'Boeing_767', B763: 'Boeing_767', B764: 'Boeing_767',
  B772: 'Boeing_777', B773: 'Boeing_777', B77L: 'Boeing_777', B77W: 'Boeing_777',
  B778: 'Boeing_777X', B779: 'Boeing_777X',
  B788: 'Boeing_787_Dreamliner', B789: 'Boeing_787_Dreamliner', B78X: 'Boeing_787_Dreamliner',
  A306: 'Airbus_A300', A30B: 'Airbus_A300', A310: 'Airbus_A310',
  DC10: 'McDonnell_Douglas_DC-10', MD11: 'McDonnell_Douglas_MD-11',

  // Narrow-body
  A318: 'Airbus_A318', A319: 'Airbus_A319', A320: 'Airbus_A320', A321: 'Airbus_A321',
  A19N: 'Airbus_A319neo', A20N: 'Airbus_A320neo_family', A21N: 'Airbus_A321neo',
  B731: 'Boeing_737', B732: 'Boeing_737', B733: 'Boeing_737_Classic', B734: 'Boeing_737_Classic',
  B735: 'Boeing_737_Classic', B736: 'Boeing_737_Next_Generation', B737: 'Boeing_737_Next_Generation',
  B738: 'Boeing_737_Next_Generation', B739: 'Boeing_737_Next_Generation',
  B37M: 'Boeing_737_MAX', B38M: 'Boeing_737_MAX', B39M: 'Boeing_737_MAX', B3XM: 'Boeing_737_MAX',
  B752: 'Boeing_757', B753: 'Boeing_757',
  B712: 'Boeing_717', B717: 'Boeing_717',
  MD80: 'McDonnell_Douglas_MD-80', MD82: 'McDonnell_Douglas_MD-80', MD83: 'McDonnell_Douglas_MD-80',
  MD87: 'McDonnell_Douglas_MD-80', MD88: 'McDonnell_Douglas_MD-80', MD90: 'McDonnell_Douglas_MD-90',
  C919: 'Comac_C919',

  // Regional jets
  E170: 'Embraer_E-Jet_family', E175: 'Embraer_E-Jet_family', E190: 'Embraer_E-Jet_family', E195: 'Embraer_E-Jet_family',
  E75S: 'Embraer_E-Jet_family', E75L: 'Embraer_E-Jet_family', E290: 'Embraer_E-Jet_E2_family', E295: 'Embraer_E-Jet_E2_family',
  CRJ1: 'Bombardier_CRJ100/200', CRJ2: 'Bombardier_CRJ100/200', CRJ7: 'Bombardier_CRJ700_series',
  CRJ9: 'Bombardier_CRJ700_series', CRJX: 'Bombardier_CRJ700_series',
  E135: 'Embraer_ERJ_145_family', E145: 'Embraer_ERJ_145_family', E35L: 'Embraer_ERJ_145_family',
  RJ85: 'British_Aerospace_146', RJ1H: 'British_Aerospace_146',
  F70: 'Fokker_70', F100: 'Fokker_100',

  // Turboprops
  AT43: 'ATR_42', AT45: 'ATR_42', AT46: 'ATR_42',
  AT72: 'ATR_72', AT73: 'ATR_72', AT75: 'ATR_72', AT76: 'ATR_72',
  DH8A: 'De_Havilland_Canada_Dash_8', DH8B: 'De_Havilland_Canada_Dash_8',
  DH8C: 'De_Havilland_Canada_Dash_8', DH8D: 'De_Havilland_Canada_Dash_8',
  DHC6: 'De_Havilland_Canada_DHC-6_Twin_Otter',
  SF34: 'Saab_340', SB20: 'Saab_2000',
  PC12: 'Pilatus_PC-12', C208: 'Cessna_208_Caravan',

  // Small prop / GA
  C150: 'Cessna_150', C152: 'Cessna_152', C172: 'Cessna_172', C182: 'Cessna_182_Skylane',
  C206: 'Cessna_206', C210: 'Cessna_210_Centurion',
  PA28: 'Piper_PA-28_Cherokee', P28A: 'Piper_PA-28_Cherokee',
  PA32: 'Piper_PA-32', PA34: 'Piper_PA-34_Seneca', PA44: 'Piper_PA-44_Seminole', PA46: 'Piper_PA-46',
  SR20: 'Cirrus_SR20', SR22: 'Cirrus_SR22',
  DA40: 'Diamond_DA40', DA42: 'Diamond_DA42', DA62: 'Diamond_DA62',
  BE33: 'Beechcraft_Bonanza', BE35: 'Beechcraft_Bonanza', BE36: 'Beechcraft_Bonanza',
  TBM7: 'Daher_TBM', TBM8: 'Daher_TBM', TBM9: 'Daher_TBM',

  // Helicopters
  R22: 'Robinson_R22', R44: 'Robinson_R44', R66: 'Robinson_R66',
  A109: 'AgustaWestland_AW109', A119: 'AgustaWestland_AW119',
  A139: 'AgustaWestland_AW139', A149: 'Leonardo_AW149', A169: 'Leonardo_AW169',
  EC35: 'Eurocopter_EC135', EC45: 'Eurocopter_EC145',
  H125: 'Airbus_Helicopters_H125', H130: 'Eurocopter_EC130', H135: 'Eurocopter_EC135',
  H145: 'Airbus_Helicopters_H145', H155: 'Eurocopter_EC155', H160: 'Airbus_Helicopters_H160',
  H175: 'Airbus_Helicopters_H175', H215: 'Airbus_Helicopters_H215', H225: 'Airbus_Helicopters_H225',
  B06: 'Bell_206', B407: 'Bell_407', B412: 'Bell_412', B429: 'Bell_429',
  S76: 'Sikorsky_S-76', S92: 'Sikorsky_S-92',
  AS50: 'Eurocopter_AS350_Écureuil',

  // Business jets
  C525: 'Cessna_CitationJet/M2', C560: 'Cessna_Citation_V', C56X: 'Cessna_Citation_Excel',
  C680: 'Cessna_Citation_Sovereign', C700: 'Cessna_Citation_Longitude', C750: 'Cessna_Citation_X',
  CL30: 'Bombardier_Challenger_300', CL35: 'Bombardier_Challenger_350', CL60: 'Bombardier_Challenger_600_series',
  GL5T: 'Bombardier_Global_5000', GLEX: 'Bombardier_Global_Express', GL7T: 'Bombardier_Global_7500',
  GLF4: 'Gulfstream_IV', GLF5: 'Gulfstream_V', G150: 'Gulfstream_G150',
  G280: 'Gulfstream_G280', GA5C: 'Gulfstream_G500/G600', GA6C: 'Gulfstream_G500/G600',
  G550: 'Gulfstream_G550', G650: 'Gulfstream_G650',
  E50P: 'Embraer_Phenom_100', E55P: 'Embraer_Phenom_300',
  LJ35: 'Learjet_35', LJ45: 'Learjet_45', LJ60: 'Learjet_60', LJ75: 'Learjet_75',
  FA50: 'Dassault_Falcon_50', FA7X: 'Dassault_Falcon_7X', F900: 'Dassault_Falcon_900',
  F2TH: 'Dassault_Falcon_2000', FA8X: 'Dassault_Falcon_8X',
  PRM1: 'Raytheon_Premier_I', BE40: 'Beechcraft_400',
  PC24: 'Pilatus_PC-24',
};

async function fetchWikipediaImage(articleTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=pageimages&format=json&pithumbsize=300&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    return page?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

/**
 * Get a photo URL for an aircraft. Returns cached result or fetches.
 * Tries planespotters.net by registration, then Wikipedia by type.
 */
export async function getAircraftPhoto(registration, icaoType) {
  const cacheKey = registration || icaoType || '';
  if (cacheKey in photoCache) return photoCache[cacheKey];

  // Try planespotters by registration
  if (registration) {
    try {
      const res = await fetch(`https://api.planespotters.net/pub/photos/reg/${registration}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.photos?.[0]?.thumbnail_large?.src) {
          photoCache[cacheKey] = data.photos[0].thumbnail_large.src;
          return photoCache[cacheKey];
        }
      }
    } catch { /* fall through */ }
  }

  // Fallback: Wikipedia image by aircraft type
  if (icaoType) {
    const article = WIKI_ARTICLES[icaoType.toUpperCase()];
    if (article) {
      const src = await fetchWikipediaImage(article);
      if (src) {
        photoCache[cacheKey] = src;
        return photoCache[cacheKey];
      }
    }
  }

  photoCache[cacheKey] = null;
  return null;
}
