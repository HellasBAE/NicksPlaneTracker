import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPlanes } from '../services/opensky';
import { getBoundingBox } from '../utils/geo';
import { SEARCH_RADIUS_KM } from '../constants';

const MAX_BACKOFF_MS = 120000;

/**
 * @param homeCoords - { lat, lng } of the home address (used as fallback)
 * @param viewBbox - { south, west, north, east } from the current map view (preferred)
 * @param options - { pollInterval, paused, credentials }
 */
export function usePlaneData(homeCoords, viewBbox, { pollInterval, paused, credentials }) {
  const [planes, setPlanes] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [currentInterval, setCurrentInterval] = useState(pollInterval);
  const [rateLimited, setRateLimited] = useState(false);
  const timeoutRef = useRef(null);
  const consecutiveErrors = useRef(0);
  const activeInterval = useRef(pollInterval);
  const bboxRef = useRef(null);

  // Keep bbox ref up to date without triggering re-fetches on every pan
  useEffect(() => {
    bboxRef.current = viewBbox;
  }, [viewBbox]);

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
        // Use map view bounds if available, otherwise fall back to home radius
        const bbox = bboxRef.current || getBoundingBox(homeCoords.lat, homeCoords.lng, SEARCH_RADIUS_KM);
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
