import { useState, useEffect, useCallback } from 'react';
import AddressInput from './components/AddressInput';
import MapView from './components/MapView';
import { useGeocode } from './hooks/useGeocode';
import { usePlaneData } from './hooks/usePlaneData';
import { useInterpolatedPlanes } from './hooks/useInterpolatedPlanes';
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
  const { geocode, loading, error: geoError } = useGeocode();
  const { planes, lastUpdated, error: planeError } = usePlaneData(homeCoords);
  const displayPlanes = useInterpolatedPlanes(planes);

  // Persist state changes to localStorage
  useEffect(() => {
    saveState({ homeCoords, displayName, address, mapView, mapLayer });
  }, [homeCoords, displayName, address, mapView, mapLayer]);

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

  return (
    <div className="app">
      <header className="header">
        <h1>Nick's Plane Tracker</h1>
        <AddressInput onLocate={handleLocate} loading={loading} initialValue={address} />
      </header>

      {geoError && <div className="error">Geocoding error: {geoError}</div>}
      {planeError && <div className="error">Plane data error: {planeError}</div>}

      <MapView
        homeCoords={homeCoords}
        displayName={displayName}
        planes={displayPlanes}
        savedMapView={mapView}
        savedLayer={mapLayer}
        onMapMove={handleMapMove}
        onLayerChange={setMapLayer}
      />

      {homeCoords && (
        <div className="status-bar">
          <span>{planes.length} plane{planes.length !== 1 ? 's' : ''} nearby</span>
          {lastUpdated && (
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
      )}
    </div>
  );
}
