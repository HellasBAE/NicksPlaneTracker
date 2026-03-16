# Hooks

**Status:** ✅ Complete

---

## usePlaneData(homeCoords, viewBbox, options)

**Path:** `src/hooks/usePlaneData.js`

Polls OpenSky Network API for live plane data.

**Input:**
- `homeCoords` — { lat, lng } for fallback radius search
- `viewBbox` — current map viewport bounds (preferred over home radius)
- `options` — { pollInterval, paused, credentials }

**Behavior:**
- Prefers `viewBbox` (current viewport); falls back to 50km radius around home
- Implements exponential backoff on rate limit (429): `delay = pollInterval × 2^errors`, capped at 120s
- Tracks error types: RATE_LIMITED, INVALID_CREDENTIALS, generic

**Returns:** `{ planes, lastUpdated, error, currentInterval, rateLimited }`

---

## useFavorites()

**Path:** `src/hooks/useFavorites.js`

Manages tracked planes, folders, and tags with localStorage persistence.

**Data shapes:**
- **Favorite:** `{ icao24, callsign, aircraftType, registration, airline, notes, customName, tags[], folders[], trackedAt, system }`
- **Folder:** `{ id, name, createdAt, system }`
- **Tag:** `{ id, name, color }`

**Key methods:**
- `addFavorite(plane)` / `removeFavorite(icao24)`
- `updateNotes(icao24, notes)` / `setCustomName(icao24, name)`
- `toggleFavoriteFolder(icao24, folderId)` / `toggleFavoriteTag(icao24, tagId)`
- `isFavorite(icao24)` / `isSystemPlane(icao24)`
- Folder CRUD: `createFolder`, `renameFolder`, `deleteFolder`
- Tag CRUD: `createTag`, `deleteTag`

**Special:** Merges system-seeded planes/folders with user data in exposed state.

---

## useInterpolatedPlanes(apiPlanes)

**Path:** `src/hooks/useInterpolatedPlanes.js`

Smoothly animates plane movement between API polls.

- Recalculates positions every 1 second
- Uses heading + velocity → lat/lng delta (spherical math)
- Skips planes on ground or with no velocity data

**Returns:** Interpolated planes array (updated every 1s)

---

## useGeocode()

**Path:** `src/hooks/useGeocode.js`

Wraps Nominatim geocoding service.

- `geocode(address)` → `{ lat, lng, displayName }`
- Exposes `loading`, `error`, `result` state

## Recent Updates

### 2026-03-16 — Initial documentation created
- Documented all 4 hooks from full codebase analysis

### Recent feature commits (pre-documentation)
- **useFavorites.js** — Added system planes merging, folder/tag CRUD, custom names, notes, toggle methods
- **usePlaneData.js** — Added viewport bbox support (prefer over home radius), exponential backoff improvements

---

**Last Updated:** 2026-03-16
