# Key Features

**Status:** ✅ Complete

---

## Track Plane with Folder Choice

1. Click plane marker on map → popup opens
2. Click "Track" → folder picker appears (if custom folders exist)
3. Select folders → confirm → plane added to favorites with selected folders

## Locate & Follow Tracked Plane

1. Click plane name in Favorites Panel
2. If plane in current view data → fly to it
3. If not → fetch globally via `fetchPlaneByIcao24()` or `fetchPlaneByRegistration()`
4. Shows LOCATING badge while fetching, then FOLLOWING badge
5. Map auto-pans to keep followed plane centered
6. Click again to stop following

## Rate Limit Backoff

- On 429 from OpenSky → exponential backoff: `pollInterval × 2^errors`, max 120s
- Shows error banner with retry countdown
- Resets on successful fetch

## Map View Planes

- `usePlaneData` prefers current viewport bounds over home radius
- As user pans/zooms → debounced bounds update (1s) → next poll uses new area
- Allows exploring planes anywhere, not just near home

## Smooth Plane Animation

- `useInterpolatedPlanes` recalculates positions every 1s between API polls
- Uses heading + velocity → lat/lng delta with spherical math
- Combined with CSS transition for gliding movement

## Nearby Alerts

- After each poll, matches visible planes against tracked favorites
- Shows golden pulsing NearbyBanner with plane names
- NEARBY badge in favorites panel

## System Planes (Billionaires)

- 6+ pre-seeded billionaire jets in `sys_billionaires` folder
- Marked `system: true` — cannot be deleted by user
- Folder cannot be renamed/deleted
- Uses N-number → ICAO24 conversion for global lookup

## Persistent State

All user data persists to localStorage:
- `npt_state` — home coords, settings, map view
- `npt_favorites` — tracked planes with metadata
- `npt_folders` — user-created folders
- `npt_tags` — user-created tags with colors

---

**Last Updated:** 2026-03-16
