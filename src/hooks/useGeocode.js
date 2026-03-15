import { useState, useCallback } from 'react';
import { geocodeAddress } from '../services/nominatim';

export function useGeocode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const geocode = useCallback(async (address) => {
    setLoading(true);
    setError(null);
    try {
      const coords = await geocodeAddress(address);
      setResult(coords);
      return coords;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { geocode, result, loading, error };
}
