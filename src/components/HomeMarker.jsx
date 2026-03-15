import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const homeIcon = L.divIcon({
  html: `<div style="font-size:28px;text-align:center;line-height:1">🏠</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: '',
});

export default function HomeMarker({ position, displayName }) {
  return (
    <Marker position={[position.lat, position.lng]} icon={homeIcon}>
      <Popup>{displayName || 'Home'}</Popup>
    </Marker>
  );
}
