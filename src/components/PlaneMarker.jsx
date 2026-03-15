import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

function createPlaneIcon(heading) {
  return L.divIcon({
    html: `<div style="font-size:22px;text-align:center;line-height:1;transform:rotate(${heading || 0}deg)">✈️</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    className: '',
  });
}

export default function PlaneMarker({ plane }) {
  const icon = createPlaneIcon(plane.heading);

  return (
    <Marker position={[plane.lat, plane.lng]} icon={icon}>
      <Popup>
        <div style={{ minWidth: 150 }}>
          <strong>{plane.callsign || 'Unknown'}</strong>
          <br />
          ICAO: {plane.icao24}
          <br />
          Country: {plane.country}
          <br />
          Altitude: {plane.altitudeFt != null ? `${plane.altitudeFt.toLocaleString()} ft` : 'N/A'}
          <br />
          Speed: {plane.speedKnots != null ? `${plane.speedKnots} kts` : 'N/A'}
          <br />
          Heading: {plane.heading != null ? `${Math.round(plane.heading)}°` : 'N/A'}
          {plane.onGround && <><br /><em>On ground</em></>}
        </div>
      </Popup>
    </Marker>
  );
}
