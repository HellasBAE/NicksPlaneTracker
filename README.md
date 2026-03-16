# Nick's Plane Tracker

A real-time aircraft tracking web app built with React + Vite. Enter any address to see live planes flying overhead, track your favorites, and organize them into folders and tags.

## Features

- **Live plane tracking** — Polls OpenSky Network API to show aircraft near any location on an interactive Leaflet map
- **Plane details** — Click any plane to see callsign, aircraft type, registration, altitude, speed, and airline info (via hexdb.io + Wikipedia fallback for photos)
- **Favorites & tracking** — Track planes you're interested in; get banner alerts when tracked planes fly nearby
- **Folders & tags** — Organize tracked planes into custom folders and color-coded tags
- **System folders** — Built-in preset folders (e.g. BILLIONAIRES) with pre-seeded plane registrations
- **Locate & follow** — Find any tracked plane worldwide and follow it on the map in real-time, even if it's outside your current view
- **Folder picker on track** — Choose which folder to assign when you start tracking a plane
- **Map view planes** — See planes for the current map viewport, not just your home radius
- **Back to Home** — Quick navigation button when you've panned away from your home location
- **Custom plane appearance** — Adjust plane icon color and size from the status bar
- **Multiple map layers** — Switch between street, satellite, and other tile layers
- **OpenSky credentials** — Optional authenticated API access for higher rate limits
- **Rate limit handling** — Exponential backoff on 429 responses with visual indicator
- **Persistent state** — All settings, favorites, folders, and tags saved to localStorage

## Tech Stack

- **Frontend**: React 19, Vite
- **Map**: Leaflet + React-Leaflet
- **Data sources**: OpenSky Network API, hexdb.io (aircraft metadata), Nominatim (geocoding), Wikipedia (aircraft photos)
- **Storage**: Browser localStorage

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173, enter an address, and start tracking planes.

## Project Structure

```
src/
├── App.jsx                    # Main app shell, state management
├── components/
│   ├── AddressInput.jsx       # Address search bar
│   ├── FavoritesPanel.jsx     # Tracked planes panel with folder/tag management
│   ├── HomeMarker.jsx         # Home location pin on map
│   ├── MapView.jsx            # Leaflet map with layer switching
│   ├── NearbyBanner.jsx       # Alert when tracked planes fly nearby
│   ├── PlaneLayer.jsx         # Renders plane icons on map
│   ├── PlaneMarker.jsx        # Individual plane marker with popup
│   └── SettingsModal.jsx      # OpenSky credentials & poll interval
├── hooks/
│   ├── useFavorites.js        # Favorites, folders, tags state + system planes
│   ├── useGeocode.js          # Nominatim geocoding
│   ├── useInterpolatedPlanes.js # Smooth plane movement between polls
│   └── usePlaneData.js        # OpenSky polling with rate limit backoff
├── services/
│   ├── nominatim.js           # Geocoding API client
│   └── opensky.js             # OpenSky Network API client
├── data/
│   └── systemFolders.js       # Built-in folder presets & seeded planes
└── constants.js               # Shared config values
```
