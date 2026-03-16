import { MapContainer, TileLayer, LayersControl, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useRef, useState, useCallback } from 'react';
import HomeMarker from './HomeMarker';
import PlaneLayer from './PlaneLayer';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../constants';

function RecenterMap({ coords }) {
  const map = useMap();
  const hasRecentered = useRef(false);

  useEffect(() => {
    if (coords && !hasRecentered.current) {
      map.setView([coords.lat, coords.lng], DEFAULT_ZOOM);
      hasRecentered.current = true;
    }
  }, [coords, map]);

  // Reset when coords change (new address search)
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], DEFAULT_ZOOM);
    }
  }, [coords?.lat, coords?.lng]);

  return null;
}

function FollowPlane({ planes, followingIcao }) {
  const map = useMap();

  useEffect(() => {
    if (!followingIcao) return;
    const plane = planes.find((p) => p.icao24 === followingIcao);
    if (plane) {
      map.setView([plane.lat, plane.lng], map.getZoom(), { animate: true });
    }
  }, [planes, followingIcao, map]);

  return null;
}

function FlyToTarget({ target, onArrived }) {
  const map = useMap();
  const [lastTarget, setLastTarget] = useState(null);

  useEffect(() => {
    if (!target || (lastTarget && target.lat === lastTarget.lat && target.lng === lastTarget.lng)) return;
    setLastTarget(target);
    map.flyTo([target.lat, target.lng], 12, { duration: 1.5 });
    if (onArrived) {
      const timer = setTimeout(onArrived, 1600);
      return () => clearTimeout(timer);
    }
  }, [target, lastTarget, map, onArrived]);

  return null;
}

function MapEventTracker({ onMapMove, onBoundsChange, onLayerChange }) {
  const map = useMap();
  const debounceRef = useRef(null);

  useMapEvents({
    moveend: (e) => {
      const m = e.target;
      const center = m.getCenter();
      onMapMove({ lat: center.lat, lng: center.lng }, m.getZoom());

      // Debounce bounds update (1s after stop moving)
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const bounds = m.getBounds();
        onBoundsChange({
          south: bounds.getSouth(),
          west: bounds.getWest(),
          north: bounds.getNorth(),
          east: bounds.getEast(),
        });
      }, 1000);
    },
  });

  // Report initial bounds
  useEffect(() => {
    const bounds = map.getBounds();
    onBoundsChange({
      south: bounds.getSouth(),
      west: bounds.getWest(),
      north: bounds.getNorth(),
      east: bounds.getEast(),
    });
  }, [map, onBoundsChange]);

  useEffect(() => {
    const handler = (e) => onLayerChange(e.name);
    map.on('baselayerchange', handler);
    return () => map.off('baselayerchange', handler);
  }, [map, onLayerChange]);

  return null;
}

function BackToHomeButton({ homeCoords, isAway }) {
  const map = useMap();

  if (!homeCoords || !isAway) return null;

  const handleClick = () => {
    map.flyTo([homeCoords.lat, homeCoords.lng], DEFAULT_ZOOM, { duration: 1.5 });
  };

  return (
    <div className="back-to-home-btn" onClick={handleClick}>
      Back to Home
    </div>
  );
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

export default function MapView({ homeCoords, displayName, planes, savedMapView, savedLayer, onMapMove, onBoundsChange, onLayerChange, planeColor, planeSize, isFavorite, onTrack, onUntrack, folders, onToggleFolder, followingIcao, flyToTarget, onFlyToArrived, isAwayFromHome }) {
  const initialCenter = savedMapView?.center
    ? [savedMapView.center.lat, savedMapView.center.lng]
    : DEFAULT_CENTER;
  const initialZoom = savedMapView?.zoom || DEFAULT_ZOOM;

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      className="map-container"
    >
      <LayersControl position="topright">
        {TILE_LAYERS.map((layer) => (
          <LayersControl.BaseLayer
            key={layer.name}
            name={layer.name}
            checked={savedLayer ? layer.name === savedLayer : (layer.checked || false)}
          >
            <TileLayer url={layer.url} attribution={layer.attribution} />
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>
      <RecenterMap coords={homeCoords} />
      <MapEventTracker onMapMove={onMapMove} onBoundsChange={onBoundsChange} onLayerChange={onLayerChange} />
      <BackToHomeButton homeCoords={homeCoords} isAway={isAwayFromHome} />
      {homeCoords && <HomeMarker position={homeCoords} displayName={displayName} />}
      <FollowPlane planes={planes} followingIcao={followingIcao} />
      <FlyToTarget target={flyToTarget} onArrived={onFlyToArrived} />
      <PlaneLayer planes={planes} planeColor={planeColor} planeSize={planeSize} isFavorite={isFavorite} onTrack={onTrack} onUntrack={onUntrack} folders={folders} onToggleFolder={onToggleFolder} />
    </MapContainer>
  );
}
