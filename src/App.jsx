import { useState, useEffect, useCallback, useMemo } from 'react';
import AddressInput from './components/AddressInput';
import MapView from './components/MapView';
import FavoritesPanel from './components/FavoritesPanel';
import NearbyBanner from './components/NearbyBanner';
import SettingsModal from './components/SettingsModal';
import { useGeocode } from './hooks/useGeocode';
import { usePlaneData } from './hooks/usePlaneData';
import { useInterpolatedPlanes } from './hooks/useInterpolatedPlanes';
import { useFavorites } from './hooks/useFavorites';
import { fetchPlaneByIcao24, fetchPlaneByRegistration } from './services/opensky';
import { POLL_INTERVAL_MS } from './constants';
import 'leaflet/dist/leaflet.css';
import './App.css';

const STORAGE_KEY = 'npt_state';

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore quota errors */ }
}

export default function App() {
  const saved = loadSaved();
  const [homeCoords, setHomeCoords] = useState(saved?.homeCoords || null);
  const [displayName, setDisplayName] = useState(saved?.displayName || '');
  const [address, setAddress] = useState(saved?.address || '');
  const [mapView, setMapView] = useState(saved?.mapView || null);
  const [mapLayer, setMapLayer] = useState(saved?.mapLayer || 'Streets');
  const [planeColor, setPlaneColor] = useState(saved?.planeColor || '#e94560');
  const [planeSize, setPlaneSize] = useState(saved?.planeSize || 32);
  const [pollInterval, setPollInterval] = useState(saved?.pollInterval || POLL_INTERVAL_MS);
  const [paused, setPaused] = useState(false);
  const [openskyUsername, setOpenskyUsername] = useState(saved?.openskyUsername || '');
  const [openskyPassword, setOpenskyPassword] = useState(saved?.openskyPassword || '');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { geocode, loading, error: geoError } = useGeocode();

  const credentials = useMemo(() => {
    if (openskyUsername && openskyPassword) {
      return { username: openskyUsername, password: openskyPassword };
    }
    return null;
  }, [openskyUsername, openskyPassword]);

  const [viewBbox, setViewBbox] = useState(null);

  const { planes, lastUpdated, error: planeError, currentInterval, rateLimited } =
    usePlaneData(homeCoords, viewBbox, { pollInterval, paused, credentials });

  const displayPlanes = useInterpolatedPlanes(planes);
  const {
    favorites, addFavorite, removeFavorite, updateNotes, updateFavorite,
    setCustomName, toggleFavoriteFolder, toggleFavoriteTag, isFavorite, isSystemPlane,
    folders, createFolder, renameFolder, deleteFolder,
    tags, createTag, deleteTag,
  } = useFavorites();
  const [followingIcao, setFollowingIcao] = useState(null);
  const [flyToTarget, setFlyToTarget] = useState(null);
  const [locatingPlane, setLocatingPlane] = useState(null);
  const [injectedPlane, setInjectedPlane] = useState(null);

  // Persist state changes to localStorage
  useEffect(() => {
    saveState({
      homeCoords, displayName, address, mapView, mapLayer,
      planeColor, planeSize, pollInterval, openskyUsername, openskyPassword,
    });
  }, [homeCoords, displayName, address, mapView, mapLayer, planeColor, planeSize, pollInterval, openskyUsername, openskyPassword]);

  const handleLocate = async (addr) => {
    setAddress(addr);
    const result = await geocode(addr);
    if (result) {
      setHomeCoords({ lat: result.lat, lng: result.lng });
      setDisplayName(result.displayName);
    }
  };

  const handleMapMove = useCallback((center, zoom) => {
    setMapView({ center, zoom });
  }, []);

  const handleBoundsChange = useCallback((bbox) => {
    setViewBbox(bbox);
  }, []);

  // Detect if the map center is far from home (>10km)
  const isAwayFromHome = useMemo(() => {
    if (!homeCoords || !mapView?.center) return false;
    const dlat = homeCoords.lat - mapView.center.lat;
    const dlng = homeCoords.lng - mapView.center.lng;
    const distKm = Math.sqrt(dlat * dlat + dlng * dlng) * 111;
    return distKm > 10;
  }, [homeCoords, mapView?.center]);

  const handleSettingsSave = (settings) => {
    setPollInterval(settings.pollInterval);
    setOpenskyUsername(settings.openskyUsername);
    setOpenskyPassword(settings.openskyPassword);
  };

  // Merge injected plane (from locate) into display planes if not already present
  const mergedPlanes = useMemo(() => {
    if (!injectedPlane) return displayPlanes;
    if (displayPlanes.some((p) => p.icao24 === injectedPlane.icao24)) return displayPlanes;
    return [...displayPlanes, injectedPlane];
  }, [displayPlanes, injectedPlane]);

  // Handle clicking a tracked plane to locate and follow it
  const handleFollowPlane = useCallback(async (icao24) => {
    // If already following, toggle off
    if (followingIcao === icao24) {
      setFollowingIcao(null);
      return;
    }

    // Check if plane is already in current data
    const existing = displayPlanes.find((p) => p.icao24 === icao24);
    if (existing) {
      setFlyToTarget({ lat: existing.lat, lng: existing.lng });
      setFollowingIcao(icao24);
      return;
    }

    // Look up the plane globally via OpenSky
    setLocatingPlane(icao24);
    try {
      let plane = null;

      // For seeded/system planes, try registration-based lookup first
      const favEntry = favorites[icao24];
      if (favEntry?.registration && icao24.startsWith('seed_')) {
        plane = await fetchPlaneByRegistration(favEntry.registration, credentials);
      }

      // Fall back to icao24 lookup if not a seed or reg lookup failed
      if (!plane && !icao24.startsWith('seed_')) {
        plane = await fetchPlaneByIcao24(icao24, credentials);
      }

      if (plane) {
        setInjectedPlane(plane);
        setFlyToTarget({ lat: plane.lat, lng: plane.lng });
        setFollowingIcao(plane.icao24);
      } else {
        setLocatingPlane(null);
        alert('Plane not found — it may not be airborne right now.');
        return;
      }
    } catch {
      alert('Could not look up plane — rate limited. Try again shortly.');
    }
    setLocatingPlane(null);
  }, [followingIcao, displayPlanes, credentials, favorites]);

  // Clear injected plane when real data includes it
  useEffect(() => {
    if (injectedPlane && planes.some((p) => p.icao24 === injectedPlane.icao24)) {
      setInjectedPlane(null);
    }
  }, [planes, injectedPlane]);

  // Find which favorites are currently nearby
  const nearbyIcaos = useMemo(() => {
    const set = new Set();
    for (const p of planes) {
      if (favorites[p.icao24]) set.add(p.icao24);
    }
    return set;
  }, [planes, favorites]);

  const nearbyFavorites = useMemo(() => {
    return [...nearbyIcaos].map((id) => favorites[id]).filter(Boolean);
  }, [nearbyIcaos, favorites]);

  const favCount = Object.keys(favorites).length;

  return (
    <div className="app">
      <header className="header">
        <h1>Nick's Plane Tracker</h1>
        <AddressInput onLocate={handleLocate} loading={loading} initialValue={address} />
        <button
          className="favorites-toggle"
          onClick={() => setShowFavorites((v) => !v)}
        >
          Tracked ({favCount})
        </button>
      </header>

      <NearbyBanner nearbyFavorites={nearbyFavorites} />

      {geoError && <div className="error">Geocoding error: {geoError}</div>}
      {planeError && <div className="error-bar">{planeError}</div>}

      <div className="main-content">
        <MapView
          homeCoords={homeCoords}
          displayName={displayName}
          planes={mergedPlanes}
          savedMapView={mapView}
          savedLayer={mapLayer}
          onMapMove={handleMapMove}
          onBoundsChange={handleBoundsChange}
          onLayerChange={setMapLayer}
          planeColor={planeColor}
          planeSize={planeSize}
          isFavorite={isFavorite}
          onTrack={addFavorite}
          onUntrack={removeFavorite}
          folders={folders}
          onToggleFolder={toggleFavoriteFolder}
          followingIcao={followingIcao}
          flyToTarget={flyToTarget}
          onFlyToArrived={() => setFlyToTarget(null)}
          isAwayFromHome={isAwayFromHome}
        />

        {showFavorites && (
          <FavoritesPanel
            favorites={favorites}
            nearbyIcaos={nearbyIcaos}
            folders={folders}
            tags={tags}
            onUpdateNotes={updateNotes}
            onRemove={removeFavorite}
            onSetCustomName={setCustomName}
            onToggleFolder={toggleFavoriteFolder}
            onToggleTag={toggleFavoriteTag}
            onCreateFolder={createFolder}
            onRenameFolder={renameFolder}
            onDeleteFolder={deleteFolder}
            onCreateTag={createTag}
            onDeleteTag={deleteTag}
            onFollowPlane={handleFollowPlane}
            locatingPlane={locatingPlane}
            isSystemPlane={isSystemPlane}
            followingIcao={followingIcao}
            onClose={() => setShowFavorites(false)}
          />
        )}
      </div>

      <div className="status-bar">
        <div className="status-left">
          {homeCoords && (
            <span className="status-info">
              {planes.length} plane{planes.length !== 1 ? 's' : ''} nearby
              {lastUpdated && <> &middot; {lastUpdated.toLocaleTimeString()}</>}
            </span>
          )}
          <span className={`status-poll ${rateLimited ? 'rate-limited' : ''}`}>
            {paused ? 'Paused' : `Poll: ${Math.round(currentInterval / 1000)}s`}
            {rateLimited && ' (rate limited)'}
            {credentials && <span className="auth-badge">AUTH</span>}
          </span>
        </div>

        <div className="status-right">
          <button
            className={`status-btn ${paused ? 'paused' : ''}`}
            onClick={() => setPaused((v) => !v)}
            title={paused ? 'Resume polling' : 'Pause polling'}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>

          <div className="plane-settings">
            <label>
              Color
              <input
                type="color"
                value={planeColor}
                onChange={(e) => setPlaneColor(e.target.value)}
              />
            </label>
            <label>
              Size
              <input
                type="range"
                min="16"
                max="56"
                value={planeSize}
                onChange={(e) => setPlaneSize(Number(e.target.value))}
              />
              <span>{planeSize}px</span>
            </label>
          </div>

          <button
            className="status-btn settings-btn"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            Settings
          </button>
        </div>
      </div>

      {showSettings && (
        <SettingsModal
          settings={{ openskyUsername, openskyPassword, pollInterval }}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
