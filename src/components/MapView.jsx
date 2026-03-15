import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import HomeMarker from './HomeMarker';
import PlaneLayer from './PlaneLayer';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../constants';

function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], DEFAULT_ZOOM);
    }
  }, [coords, map]);
  return null;
}

export default function MapView({ homeCoords, displayName, planes }) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap coords={homeCoords} />
      {homeCoords && <HomeMarker position={homeCoords} displayName={displayName} />}
      <PlaneLayer planes={planes} />
    </MapContainer>
  );
}
