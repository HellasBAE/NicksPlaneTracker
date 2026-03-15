/**
 * Geocode an address string to { lat, lng } using Nominatim (OpenStreetMap).
 */
export async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    q: address,
    format: 'json',
    limit: '1',
  })}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'NicksPlaneTracker/1.0' },
  });

  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

  const data = await res.json();
  if (data.length === 0) throw new Error('Address not found');

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
