import { useState, useEffect, useRef } from 'react';
import { fetchPlanes } from '../services/opensky';
import { getBoundingBox } from '../utils/geo';
import { SEARCH_RADIUS_KM, POLL_INTERVAL_MS } from '../constants';

export function usePlaneData(homeCoords) {
  const [planes, setPlanes] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!homeCoords) return;

    const load = async () => {
      try {
        const bbox = getBoundingBox(homeCoords.lat, homeCoords.lng, SEARCH_RADIUS_KM);
        const data = await fetchPlanes(bbox);
        setPlanes(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    load();
    intervalRef.current = setInterval(load, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [homeCoords]);

  return { planes, lastUpdated, error };
}
