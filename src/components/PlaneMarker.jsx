import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getAirline } from '../utils/airlines';

function planeSvg(color, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
  <path d="M12 2 L14 9 L21 11 L14 13 L14 20 L12 18 L10 20 L10 13 L3 11 L10 9 Z"
    fill="${color}" stroke="#fff" stroke-width="0.8"/>
</svg>`;
}

function createPlaneIcon(heading, color, size) {
  return L.divIcon({
    html: `<div style="
      display:flex;
      align-items:center;
      justify-content:center;
      width:${size}px;
      height:${size}px;
      transform:rotate(${heading || 0}deg);
      transition: transform 1s linear;
    ">${planeSvg(color, size)}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: 'plane-icon',
  });
}

export default function PlaneMarker({ plane, color, size }) {
  const icon = createPlaneIcon(plane.heading, color, size);
  const airline = getAirline(plane.callsign);

  return (
    <Marker position={[plane.lat, plane.lng]} icon={icon}>
      <Popup>
        <div style={{ minWidth: 150 }}>
          <strong>{plane.callsign || 'Unknown'}</strong>
          {airline && <><br />{airline}</>}
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
