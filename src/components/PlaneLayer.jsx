import PlaneMarker from './PlaneMarker';

export default function PlaneLayer({ planes, planeColor, planeSize, isFavorite, onTrack, onUntrack, folders, onToggleFolder }) {
  return (
    <>
      {planes.map((plane) => (
        <PlaneMarker
          key={plane.icao24}
          plane={plane}
          color={planeColor}
          size={planeSize}
          isFavorite={isFavorite(plane.icao24)}
          onTrack={onTrack}
          onUntrack={onUntrack}
          folders={folders}
          onToggleFolder={onToggleFolder}
        />
      ))}
    </>
  );
}
