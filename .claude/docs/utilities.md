# Utilities

**Status:** ✅ Complete

---

## geo.js — Geospatial Calculations

**Path:** `src/utils/geo.js`

- `getBoundingBox(lat, lng, radiusKm)` — calculates bounding box around a point using spherical Earth model. Returns `{ south, north, west, east }` for OpenSky API.

---

## airlines.js — Aircraft Info Lookup

**Path:** `src/utils/airlines.js`

- **Static AIRLINES map:** ~90 three-letter codes → airline names (AAL → American Airlines, etc.)
- **hexdb.io integration:** Throttled API calls (max 3 concurrent, 200ms spacing) with cache + 404 tracking
- `getAirline(callsign)` — extracts 3-letter prefix, looks up static table
- `getAircraftInfoAsync(callsign, icao24, onResult)` — fetches aircraft details from hexdb.io, falls back to static lookup. Returns `{ airline, aircraftType, icaoType, registration }`

---

## aircraftPhotos.js — Photo Fetching

**Path:** `src/utils/aircraftPhotos.js`

- `getAircraftPhoto(registration, icaoType)` — tries planespotters.net by registration first, falls back to Wikipedia by ICAO type code. Caches results.
- **Wiki article map:** ~100 aircraft types → Wikipedia article names

---

## planeSilhouettes.js — SVG Plane Icons

**Path:** `src/utils/planeSilhouettes.js`

- **7 categories:** widebody, narrowbody, regionaljet, turboprop, smallprop, helicopter, generic
- **TYPE_MAP:** ~200 ICAO codes → category
- `getPlaneSvg(icaoType, color, size)` — returns colorized SVG string (pointing north, rotation applied by PlaneMarker)

---

**Last Updated:** 2026-03-16
