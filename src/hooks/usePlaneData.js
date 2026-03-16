import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPlanes } from '../services/opensky';
import { getBoundingBox } from '../utils/geo';
import { SEARCH_RADIUS_KM, POLL_INTERVAL_MS } from '../constants';

const MAX_BACKOFF_MS = 120000; // 2 minutes max

export function usePlaneData(homeCoords) {
  const [planes, setPlanes] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const intervalMs = useRef(POLL_INTERVAL_MS);
  const consecutiveErrors = useRef(0);

  const schedule = useCallback((fn, ms) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fn, ms);
  }, []);

  useEffect(() => {
    if (!homeCoords) return;

    const load = async () => {
      try {
        const bbox = getBoundingBox(homeCoords.lat, homeCoords.lng, SEARCH_RADIUS_KM);
        const data = await fetchPlanes(bbox);
        setPlanes(data);
        setLastUpdated(new Date());
        setError(null);
        consecutiveErrors.current = 0;
        intervalMs.current = POLL_INTERVAL_MS;
      } catch (err) {
        consecutiveErrors.current++;
        if (err.message.includes('429')) {
          // Back off exponentially on rate limit
          intervalMs.current = Math.min(
            POLL_INTERVAL_MS * Math.pow(2, consecutiveErrors.current),
            MAX_BACKOFF_MS
          );
          setError(`Rate limited — retrying in ${Math.round(intervalMs.current / 1000)}s`);
        } else {
          setError(err.message);
        }
        // Keep existing planes on screen during errors
      }
      schedule(load, intervalMs.current);
    };

    load();
    return () => clearTimeout(timeoutRef.current);
  }, [homeCoords, schedule]);

  return { planes, lastUpdated, error };
}
