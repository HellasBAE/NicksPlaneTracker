import PlaneMarker from './PlaneMarker';

export default function PlaneLayer({ planes, planeColor, planeSize }) {
  return (
    <>
      {planes.map((plane) => (
        <PlaneMarker key={plane.icao24} plane={plane} color={planeColor} size={planeSize} />
      ))}
    </>
  );
}
