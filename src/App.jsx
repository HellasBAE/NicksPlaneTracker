import { useState, useEffect, useCallback, useMemo } from 'react';
import AddressInput from './components/AddressInput';
import MapView from './components/MapView';
import FavoritesPanel from './components/FavoritesPanel';
import NearbyBanner from './components/NearbyBanner';
import { useGeocode } from './hooks/useGeocode';
import { usePlaneData } from './hooks/usePlaneData';
import { useInterpolatedPlanes } from './hooks/useInterpolatedPlanes';
import { useFavorites } from './hooks/useFavorites';
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
  const [showFavorites, setShowFavorites] = useState(false);
  const { geocode, loading, error: geoError } = useGeocode();
  const { planes, lastUpdated, error: planeError } = usePlaneData(homeCoords);
  const displayPlanes = useInterpolatedPlanes(planes);
  const { favorites, addFavorite, removeFavorite, updateNotes, isFavorite } = useFavorites();

  // Persist state changes to localStorage
  useEffect(() => {
    saveState({ homeCoords, displayName, address, mapView, mapLayer, planeColor, planeSize });
  }, [homeCoords, displayName, address, mapView, mapLayer, planeColor, planeSize]);

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

  // Find which favorites are currently nearby (visible in plane data)
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
      {planeError && <div className="error">Plane data error: {planeError}</div>}

      <div className="main-content">
        <MapView
          homeCoords={homeCoords}
          displayName={displayName}
          planes={displayPlanes}
          savedMapView={mapView}
          savedLayer={mapLayer}
          onMapMove={handleMapMove}
          onLayerChange={setMapLayer}
          planeColor={planeColor}
          planeSize={planeSize}
          isFavorite={isFavorite}
          onTrack={addFavorite}
          onUntrack={removeFavorite}
        />

        {showFavorites && (
          <FavoritesPanel
            favorites={favorites}
            nearbyIcaos={nearbyIcaos}
            onUpdateNotes={updateNotes}
            onRemove={removeFavorite}
            onClose={() => setShowFavorites(false)}
          />
        )}
      </div>

      <div className="status-bar">
        {homeCoords && (
          <span className="status-info">
            {planes.length} plane{planes.length !== 1 ? 's' : ''} nearby
            {lastUpdated && <> &middot; {lastUpdated.toLocaleTimeString()}</>}
          </span>
        )}
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
      </div>
    </div>
  );
}
