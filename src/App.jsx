import { useState } from 'react';
import AddressInput from './components/AddressInput';
import MapView from './components/MapView';
import { useGeocode } from './hooks/useGeocode';
import { usePlaneData } from './hooks/usePlaneData';
import { useInterpolatedPlanes } from './hooks/useInterpolatedPlanes';
import 'leaflet/dist/leaflet.css';
import './App.css';

export default function App() {
  const [homeCoords, setHomeCoords] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const { geocode, loading, error: geoError } = useGeocode();
  const { planes, lastUpdated, error: planeError } = usePlaneData(homeCoords);
  const displayPlanes = useInterpolatedPlanes(planes);

  const handleLocate = async (address) => {
    const result = await geocode(address);
    if (result) {
      setHomeCoords({ lat: result.lat, lng: result.lng });
      setDisplayName(result.displayName);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Nick's Plane Tracker</h1>
        <AddressInput onLocate={handleLocate} loading={loading} />
      </header>

      {geoError && <div className="error">Geocoding error: {geoError}</div>}
      {planeError && <div className="error">Plane data error: {planeError}</div>}

      <MapView homeCoords={homeCoords} displayName={displayName} planes={displayPlanes} />

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
