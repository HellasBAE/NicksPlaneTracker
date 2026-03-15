/**
 * Calculate a bounding box around a lat/lng point with a given radius in km.
 * Returns { south, west, north, east } (lamin, lomin, lamax, lomax for OpenSky).
 */
export function getBoundingBox(lat, lng, radiusKm) {
  const latDelta = radiusKm / 111.32;
  const lngDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

  return {
    south: lat - latDelta,
    north: lat + latDelta,
    west: lng - lngDelta,
    east: lng + lngDelta,
  };
}
