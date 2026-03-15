import { useState, useEffect, useRef } from 'react';

const INTERPOLATION_INTERVAL_MS = 1000;

/**
 * Smoothly interpolates plane positions between API polls
 * based on each plane's heading and velocity.
 */
export function useInterpolatedPlanes(apiPlanes) {
  const [displayPlanes, setDisplayPlanes] = useState([]);
  const lastFetchTime = useRef(Date.now());
  const basePlanes = useRef([]);

  // When new API data arrives, snapshot it as the base for interpolation
  useEffect(() => {
    basePlanes.current = apiPlanes.map((p) => ({ ...p }));
    lastFetchTime.current = Date.now();
    setDisplayPlanes(apiPlanes);
  }, [apiPlanes]);

  // Interpolate positions every second
  useEffect(() => {
    if (basePlanes.current.length === 0) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - lastFetchTime.current) / 1000; // seconds

      const interpolated = basePlanes.current.map((plane) => {
        if (!plane.velocityMs || plane.heading == null || plane.onGround) {
          return plane;
        }

        const headingRad = (plane.heading * Math.PI) / 180;
        const distanceM = plane.velocityMs * elapsed;

        // Approximate displacement in degrees
        const dLat = (distanceM * Math.cos(headingRad)) / 111320;
        const dLng = (distanceM * Math.sin(headingRad)) /
          (111320 * Math.cos((plane.lat * Math.PI) / 180));

        return {
          ...plane,
          lat: plane.lat + dLat,
          lng: plane.lng + dLng,
        };
      });

      setDisplayPlanes(interpolated);
    }, INTERPOLATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [apiPlanes]);

  return displayPlanes;
}
