import PlaneMarker from './PlaneMarker';

export default function PlaneLayer({ planes }) {
  return (
    <>
      {planes.map((plane) => (
        <PlaneMarker key={plane.icao24} plane={plane} />
      ))}
    </>
  );
}
