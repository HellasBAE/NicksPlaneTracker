export default function NearbyBanner({ nearbyFavorites }) {
  if (nearbyFavorites.length === 0) return null;

  const names = nearbyFavorites.map((f) =>
    f.callsign || f.registration || f.icao24
  ).join(', ');

  return (
    <div className="nearby-banner">
      <span className="nearby-banner-icon">*</span>
      Tracked plane{nearbyFavorites.length > 1 ? 's' : ''} nearby: <strong>{names}</strong>
    </div>
  );
}
