# Architecture Overview

**Status:** ✅ Complete

---

## Tech Stack

- **Framework:** React 19.2 + Vite 8
- **Map:** Leaflet 1.9.4 + react-leaflet 5.0
- **Linting:** ESLint 9 with React hooks/refresh plugins
- **State:** useState + custom hooks (no Redux/Context)
- **Persistence:** localStorage
- **Build:** `npm run dev` / `npm run build` → `/dist`

## Project Structure

```
src/
├── App.jsx              # Root component, all top-level state
├── App.css              # Full app styles (dark theme, gold accents)
├── main.jsx             # React entry point
├── constants.js         # Default center (Athens), zoom, radius, poll interval
├── components/
│   ├── MapView.jsx      # Leaflet map wrapper + sub-components
│   ├── PlaneLayer.jsx   # Renders PlaneMarker for each plane
│   ├── PlaneMarker.jsx  # Individual plane icon + popup details
│   ├── HomeMarker.jsx   # 🏠 marker at home location
│   ├── FavoritesPanel.jsx # Side panel for tracked planes management
│   ├── AddressInput.jsx # Search bar for home address
│   ├── NearbyBanner.jsx # Golden alert when tracked planes nearby
│   └── SettingsModal.jsx # Poll interval + OpenSky credentials
├── hooks/
│   ├── usePlaneData.js       # OpenSky polling with backoff
│   ├── useFavorites.js       # Favorites/folders/tags CRUD + localStorage
│   ├── useInterpolatedPlanes.js # Smooth plane animation between polls
│   └── useGeocode.js         # Address → coords via Nominatim
├── services/
│   ├── opensky.js       # OpenSky Network API client
│   └── nominatim.js     # Nominatim geocoding client
├── utils/
│   ├── geo.js           # Bounding box calculation
│   ├── airlines.js      # Airline lookup + hexdb.io aircraft info
│   ├── aircraftPhotos.js # Photo fetching (planespotters + Wikipedia)
│   └── planeSilhouettes.js # SVG plane icons by aircraft category
└── data/
    └── systemFolders.js # Seeded billionaire planes + system folders
```

## Data Flow

```
User enters address
  → useGeocode → Nominatim → { lat, lng }
  → App sets homeCoords + mapView
  → usePlaneData polls OpenSky (bbox from viewport or home radius)
  → useInterpolatedPlanes smooths positions every 1s
  → MapView renders PlaneMarkers
  → User tracks planes → useFavorites persists to localStorage
  → NearbyBanner alerts when tracked planes appear in view
```

## State Management

All state lives in **App.jsx** and is passed down as props. No Context API or Redux.

| Hook | Responsibility | localStorage Key |
|------|---------------|-----------------|
| App.jsx (useState) | Home coords, map view, settings, UI state | `npt_state` |
| useFavorites | Tracked planes, folders, tags | `npt_favorites`, `npt_folders`, `npt_tags` |
| usePlaneData | Live plane array, polling, backoff | (none) |
| useInterpolatedPlanes | Smoothed plane positions | (none) |
| useGeocode | Address search state | (none) |

## External APIs

| API | Purpose | Auth |
|-----|---------|------|
| OpenSky Network | Live aircraft positions | Optional Basic Auth (higher rate limits) |
| Nominatim (OSM) | Address geocoding | None |
| hexdb.io | Aircraft metadata (reg, type) | None (throttled client-side) |
| planespotters.net | Aircraft photos by registration | None |
| Wikipedia API | Generic aircraft type photos | None |

## localStorage Schema

```javascript
npt_state: { homeCoords, displayName, address, mapView, mapLayer,
             planeColor, planeSize, pollInterval, openskyUsername, openskyPassword }

npt_favorites: { [icao24]: { icao24, callsign, aircraftType, registration,
                              airline, notes, customName, tags[], folders[], trackedAt, system } }

npt_folders: { [id]: { id, name, createdAt } }

npt_tags: { [id]: { id, name, color } }
```

## Recent Updates

### 2026-03-16 — Initial documentation created
- Full architecture documentation from codebase analysis
- Covers all modules, data flow, state management, APIs, and localStorage schema

---

**Last Updated:** 2026-03-16
