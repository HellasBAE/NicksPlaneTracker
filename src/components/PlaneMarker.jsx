import { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getAirlineAsync } from '../utils/airlines';

function planeSvg(color, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  <defs>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g filter="url(#s)">
    <!-- fuselage -->
    <path d="M16 3 C16.8 3 17.5 5 17.5 8 L17.5 12 L17 20 L16 26 L15 20 L14.5 12 L14.5 8 C14.5 5 15.2 3 16 3Z"
      fill="${color}" stroke="#fff" stroke-width="0.5"/>
    <!-- main wings -->
    <path d="M14.5 12.5 L3 16 L3 17.2 L14.8 14.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <path d="M17.5 12.5 L29 16 L29 17.2 L17.2 14.5Z" fill="${color}" stroke="#fff" stroke-width="0.4"/>
    <!-- tail wings -->
    <path d="M15.2 20 L10 22 L10 22.8 L15.3 21Z" fill="${color}" stroke="#fff" stroke-width="0.3"/>
    <path d="M16.8 20 L22 22 L22 22.8 L16.7 21Z" fill="${color}" stroke="#fff" stroke-width="0.3"/>
    <!-- tail fin -->
    <path d="M16 20 L16 26 L15.2 23 L16 20Z" fill="${color}" opacity="0.7"/>
    <path d="M16 20 L16 26 L16.8 23 L16 20Z" fill="#fff" opacity="0.15"/>
    <!-- cockpit -->
    <ellipse cx="16" cy="6.5" rx="1" ry="2" fill="#fff" opacity="0.25"/>
  </g>
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
  const [airline, setAirline] = useState(null);

  useEffect(() => {
    getAirlineAsync(plane.callsign, plane.icao24, setAirline);
  }, [plane.callsign, plane.icao24]);

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
