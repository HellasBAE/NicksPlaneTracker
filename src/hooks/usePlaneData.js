import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPlanes } from '../services/opensky';
import { getBoundingBox } from '../utils/geo';
import { SEARCH_RADIUS_KM } from '../constants';

const MAX_BACKOFF_MS = 120000;

export function usePlaneData(homeCoords, { pollInterval, paused, credentials }) {
  const [planes, setPlanes] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [currentInterval, setCurrentInterval] = useState(pollInterval);
  const [rateLimited, setRateLimited] = useState(false);
  const timeoutRef = useRef(null);
  const consecutiveErrors = useRef(0);
  const activeInterval = useRef(pollInterval);

  // Update active interval when user changes it
  useEffect(() => {
    activeInterval.current = pollInterval;
    setCurrentInterval(pollInterval);
  }, [pollInterval]);

  const schedule = useCallback((fn, ms) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fn, ms);
  }, []);

  useEffect(() => {
    if (!homeCoords || paused) {
      clearTimeout(timeoutRef.current);
      return;
    }

    const load = async () => {
      try {
        const bbox = getBoundingBox(homeCoords.lat, homeCoords.lng, SEARCH_RADIUS_KM);
        const data = await fetchPlanes(bbox, credentials);
        setPlanes(data);
        setLastUpdated(new Date());
        setError(null);
        setRateLimited(false);
        consecutiveErrors.current = 0;
        activeInterval.current = pollInterval;
        setCurrentInterval(pollInterval);
      } catch (err) {
        consecutiveErrors.current++;
        if (err.message === 'RATE_LIMITED') {
          const backoff = Math.min(
            pollInterval * Math.pow(2, consecutiveErrors.current),
            MAX_BACKOFF_MS
          );
          activeInterval.current = backoff;
          setCurrentInterval(backoff);
          setRateLimited(true);
          setError(`Rate limited — retrying in ${Math.round(backoff / 1000)}s`);
        } else if (err.message === 'INVALID_CREDENTIALS') {
          setError('Invalid OpenSky credentials — check username/password');
          setRateLimited(false);
        } else {
          setError(err.message);
          setRateLimited(false);
        }
      }
      schedule(load, activeInterval.current);
    };

    load();
    return () => clearTimeout(timeoutRef.current);
  }, [homeCoords, paused, credentials, pollInterval, schedule]);

  return { planes, lastUpdated, error, currentInterval, rateLimited };
}
