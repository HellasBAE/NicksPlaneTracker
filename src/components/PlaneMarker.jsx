import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getAirline } from '../utils/airlines';

function createPlaneIcon(heading) {
  return L.divIcon({
    html: `<div style="
      font-size:22px;
      text-align:center;
      line-height:1;
      transform:rotate(${heading || 0}deg);
      transition: transform 1s linear;
    ">✈️</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    className: 'plane-icon',
  });
}

export default function PlaneMarker({ plane }) {
  const icon = createPlaneIcon(plane.heading);
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
