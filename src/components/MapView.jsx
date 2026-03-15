import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet';
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

const TILE_LAYERS = [
  {
    name: 'Streets',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    checked: true,
  },
  {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
  {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
  {
    name: 'Minimal (No Roads)',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    name: 'Dark (No Roads)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
];

export default function MapView({ homeCoords, displayName, planes }) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="map-container"
    >
      <LayersControl position="topright">
        {TILE_LAYERS.map((layer) => (
          <LayersControl.BaseLayer
            key={layer.name}
            name={layer.name}
            checked={layer.checked || false}
          >
            <TileLayer url={layer.url} attribution={layer.attribution} />
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>
      <RecenterMap coords={homeCoords} />
      {homeCoords && <HomeMarker position={homeCoords} displayName={displayName} />}
      <PlaneLayer planes={planes} />
    </MapContainer>
  );
}
