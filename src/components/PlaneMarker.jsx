import { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getAircraftInfoAsync } from '../utils/airlines';
import { getPlaneSvg } from '../utils/planeSilhouettes';
import { getAircraftPhoto } from '../utils/aircraftPhotos';

const FAVORITE_COLOR = '#ffd700';

function createPlaneIcon(heading, color, size, icaoType, isFav) {
  const displayColor = isFav ? FAVORITE_COLOR : color;
  const svg = getPlaneSvg(icaoType, displayColor, size);
  const glow = isFav
    ? `filter:drop-shadow(0 0 4px ${FAVORITE_COLOR}) drop-shadow(0 0 8px ${FAVORITE_COLOR});`
    : '';
  return L.divIcon({
    html: `<div style="
      display:flex;
      align-items:center;
      justify-content:center;
      width:${size}px;
      height:${size}px;
      transform:rotate(${heading || 0}deg);
      transition: transform 1s linear;
      ${glow}
    ">${svg}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: 'plane-icon',
  });
}

export default function PlaneMarker({ plane, color, size, isFavorite, onTrack, onUntrack }) {
  const [info, setInfo] = useState({ airline: null, aircraftType: null, icaoType: null, registration: null });

  useEffect(() => {
    getAircraftInfoAsync(plane.callsign, plane.icao24, setInfo);
  }, [plane.callsign, plane.icao24]);

  const icon = createPlaneIcon(plane.heading, color, size, info.icaoType, isFavorite);

  const [photoSrc, setPhotoSrc] = useState(null);

  useEffect(() => {
    if (!info.registration && !info.icaoType) return;
    let cancelled = false;
    getAircraftPhoto(info.registration, info.icaoType).then((src) => {
      if (!cancelled) setPhotoSrc(src);
    });
    return () => { cancelled = true; };
  }, [info.registration, info.icaoType]);

  const handleTrack = () => {
    onTrack({
      icao24: plane.icao24,
      callsign: plane.callsign,
      aircraftType: info.aircraftType,
      registration: info.registration,
      airline: info.airline,
    });
  };

  return (
    <Marker position={[plane.lat, plane.lng]} icon={icon}>
      <Popup maxWidth={280}>
        <div style={{ minWidth: 200 }}>
          {photoSrc && (
            <img
              src={photoSrc}
              alt={info.aircraftType || 'Aircraft'}
              style={{ width: '100%', borderRadius: 4, marginBottom: 6 }}
            />
          )}
          <strong style={{ fontSize: '1.05em' }}>{plane.callsign || 'Unknown'}</strong>
          {info.airline && <><br />{info.airline}</>}
          {info.aircraftType && <><br />Aircraft: {info.aircraftType}</>}
          {info.registration && <><br />Reg: {info.registration}</>}
          <br />
          Country: {plane.country}
          <br />
          Altitude: {plane.altitudeFt != null ? `${plane.altitudeFt.toLocaleString()} ft` : 'N/A'}
          <br />
          Speed: {plane.speedKnots != null ? `${plane.speedKnots} kts` : 'N/A'}
          <br />
          Heading: {plane.heading != null ? `${Math.round(plane.heading)}°` : 'N/A'}
          {plane.onGround && <><br /><em>On ground</em></>}
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.85em' }}>
              {info.registration && (
                <a
                  href={`https://www.flightradar24.com/data/aircraft/${info.registration}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: 8 }}
                >
                  FlightRadar24
                </a>
              )}
              {info.icaoType && (
                <a
                  href={`https://contentzone.eurocontrol.int/aircraftperformance/details.aspx?ICAO=${info.icaoType}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tech Specs
                </a>
              )}
            </div>
            {isFavorite ? (
              <button onClick={() => onUntrack(plane.icao24)} className="track-btn untrack">Untrack</button>
            ) : (
              <button onClick={handleTrack} className="track-btn">Track</button>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
