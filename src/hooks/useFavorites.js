import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'npt_favorites';

function load() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(favs) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch { /* ignore */ }
}

/**
 * Favorites hook. Stores tracked planes by icao24 with metadata and notes.
 * Shape: { [icao24]: { icao24, callsign, aircraftType, registration, airline, notes, trackedAt } }
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(load);

  useEffect(() => {
    save(favorites);
  }, [favorites]);

  const addFavorite = useCallback((plane) => {
    setFavorites((prev) => ({
      ...prev,
      [plane.icao24]: {
        icao24: plane.icao24,
        callsign: plane.callsign || '',
        aircraftType: plane.aircraftType || '',
        registration: plane.registration || '',
        airline: plane.airline || '',
        notes: '',
        trackedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const removeFavorite = useCallback((icao24) => {
    setFavorites((prev) => {
      const next = { ...prev };
      delete next[icao24];
      return next;
    });
  }, []);

  const updateNotes = useCallback((icao24, notes) => {
    setFavorites((prev) => {
      if (!prev[icao24]) return prev;
      return { ...prev, [icao24]: { ...prev[icao24], notes } };
    });
  }, []);

  const isFavorite = useCallback((icao24) => {
    return icao24 in favorites;
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, updateNotes, isFavorite };
}
