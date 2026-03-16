# Components

**Status:** ✅ Complete

---

## App.jsx — Root Component

**Path:** `src/App.jsx`

Root component that owns all top-level state and orchestrates the application.

**Responsibilities:**
- Loads/saves app state to localStorage (`npt_state`)
- Manages home coordinates, map view, plane display settings
- Coordinates plane polling via `usePlaneData` and interpolation via `useInterpolatedPlanes`
- Handles "follow plane" logic — locates planes globally via OpenSky API
- Injects located planes into display data temporarily
- Detects nearby favorites and calculates "away from home" distance

---

## MapView.jsx — Leaflet Map Wrapper

**Path:** `src/components/MapView.jsx`

Wraps the Leaflet map with several internal sub-components:

- **RecenterMap** — centers on home when first loaded
- **FollowPlane** — auto-pans map to follow a tracked plane
- **FlyToTarget** — animates flyTo when locating a plane
- **MapEventTracker** — captures viewport bounds (debounced 1s), detects layer changes
- **BackToHomeButton** — floating button when user pans >10km from home

**Features:**
- 6 tile layer options (Streets, Satellite, Terrain, Dark, etc.)
- Auto-saves selected layer preference

---

## PlaneMarker.jsx — Individual Plane

**Path:** `src/components/PlaneMarker.jsx`

Renders a single plane on the map with dynamic SVG icon rotated to heading.

**Popup shows:**
- Aircraft photo (planespotters → Wikipedia fallback)
- Callsign, airline, aircraft type, registration
- Altitude, speed, heading
- Track/Untrack button with folder picker
- Links to FlightRadar24 and tech specs
- Golden glow for favorited planes

---

## PlaneLayer.jsx — Plane Collection

**Path:** `src/components/PlaneLayer.jsx`

Simple component that maps plane array → `<PlaneMarker>` for each.

---

## HomeMarker.jsx — Home Pin

**Path:** `src/components/HomeMarker.jsx`

🏠 emoji marker at home coordinates. Shows street address in popup.

---

## FavoritesPanel.jsx — Tracked Planes Management

**Path:** `src/components/FavoritesPanel.jsx`

Rich side panel (360px) for managing tracked planes.

**Features:**
- Folder dropdown selector (filter planes by folder)
- Folder CRUD (add, rename, delete)
- Tag CRUD (add with color picker, delete)
- Per-favorite: click name to locate/follow, manage dropdown (edit name, toggle folders/tags, add notes)
- Badges: NEARBY, FOLLOWING, LOCATING
- System planes marked with [S], cannot be deleted
- Confirmation required to untrack

---

## AddressInput.jsx — Search Bar

**Path:** `src/components/AddressInput.jsx`

Text input + "Locate" button. Disables during geocoding.

---

## NearbyBanner.jsx — Alert Banner

**Path:** `src/components/NearbyBanner.jsx`

Golden pulsing banner at top showing names of tracked planes currently in view.

---

## SettingsModal.jsx — Settings Dialog

**Path:** `src/components/SettingsModal.jsx`

- Poll interval selector (5–300 seconds)
- OpenSky credentials input (username + password)
- Note that credentials are stored locally only

## Recent Updates

### 2026-03-16 — Initial documentation created
- Documented all 8 components from full codebase analysis

### Recent feature commits (pre-documentation)
- **FavoritesPanel.jsx** — Added folder dropdown selector, folder/tag CRUD, system plane [S] badges, manage panel with notes/custom names
- **PlaneMarker.jsx** — Added folder picker on track, aircraft photo display, FlightRadar24 links
- **MapView.jsx** — Added Back to Home button, viewport-based plane fetching, 6 tile layers
- **PlaneLayer.jsx** — Updated to pass new props for favorites integration

---

**Last Updated:** 2026-03-16
