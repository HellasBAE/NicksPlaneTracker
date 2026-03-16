# Services

**Status:** ✅ Complete

---

## opensky.js — OpenSky Network API Client

**Path:** `src/services/opensky.js`

**Functions:**

- `fetchPlanes(bbox, credentials)` — fetches all planes within a bounding box. Optional Basic Auth for higher rate limits (~4000/day vs ~100). Throws `RATE_LIMITED` (429) or `INVALID_CREDENTIALS` (401).

- `fetchPlaneByIcao24(icao24, credentials)` — looks up a single plane globally by hex code. Returns plane object or null if not airborne.

- `fetchPlaneByRegistration(registration, credentials)` — for system planes with N-numbers. Converts US registration to ICAO24 hex using a complex mapping algorithm (0xA00001–0xAFFFFF range), then fetches by hex.

- `parseStates(data)` — transforms OpenSky array format to readable objects: `{ icao24, callsign, country, lat, lng, altitudeM, altitudeFt, onGround, velocityMs, speedKnots, heading, verticalRate }`

---

## nominatim.js — Geocoding Client

**Path:** `src/services/nominatim.js`

- `geocodeAddress(address)` — queries OpenStreetMap Nominatim API. Returns `{ lat, lng, displayName }`. Throws if address not found.

---

**Last Updated:** 2026-03-16
