import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'npt_favorites';
const FOLDERS_KEY = 'npt_folders';
const TAGS_KEY = 'npt_tags';

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
}

/**
 * Favorites shape:
 * { [icao24]: { icao24, callsign, aircraftType, registration, airline,
 *               notes, customName, tags: [], folders: [], trackedAt } }
 *
 * Folders: { [id]: { id, name, createdAt } }
 * Tags: { [id]: { id, name, color } }
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => loadJson(FAVORITES_KEY, {}));
  const [folders, setFolders] = useState(() => loadJson(FOLDERS_KEY, {}));
  const [tags, setTags] = useState(() => loadJson(TAGS_KEY, {}));

  useEffect(() => { saveJson(FAVORITES_KEY, favorites); }, [favorites]);
  useEffect(() => { saveJson(FOLDERS_KEY, folders); }, [folders]);
  useEffect(() => { saveJson(TAGS_KEY, tags); }, [tags]);

  // --- Favorites ---
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
        customName: '',
        tags: [],
        folders: [],
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

  const updateFavorite = useCallback((icao24, updates) => {
    setFavorites((prev) => {
      if (!prev[icao24]) return prev;
      return { ...prev, [icao24]: { ...prev[icao24], ...updates } };
    });
  }, []);

  const updateNotes = useCallback((icao24, notes) => {
    updateFavorite(icao24, { notes });
  }, [updateFavorite]);

  const setCustomName = useCallback((icao24, customName) => {
    updateFavorite(icao24, { customName });
  }, [updateFavorite]);

  const toggleFavoriteFolder = useCallback((icao24, folderId) => {
    setFavorites((prev) => {
      const fav = prev[icao24];
      if (!fav) return prev;
      const folders = fav.folders || [];
      const next = folders.includes(folderId)
        ? folders.filter((f) => f !== folderId)
        : [...folders, folderId];
      return { ...prev, [icao24]: { ...fav, folders: next } };
    });
  }, []);

  const toggleFavoriteTag = useCallback((icao24, tagId) => {
    setFavorites((prev) => {
      const fav = prev[icao24];
      if (!fav) return prev;
      const tags = fav.tags || [];
      const next = tags.includes(tagId)
        ? tags.filter((t) => t !== tagId)
        : [...tags, tagId];
      return { ...prev, [icao24]: { ...fav, tags: next } };
    });
  }, []);

  const isFavorite = useCallback((icao24) => {
    return icao24 in favorites;
  }, [favorites]);

  // --- Folders ---
  const createFolder = useCallback((name) => {
    const id = 'f_' + Date.now();
    setFolders((prev) => ({ ...prev, [id]: { id, name, createdAt: new Date().toISOString() } }));
    return id;
  }, []);

  const renameFolder = useCallback((id, name) => {
    setFolders((prev) => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], name } };
    });
  }, []);

  const deleteFolder = useCallback((id) => {
    setFolders((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // Remove folder from all favorites
    setFavorites((prev) => {
      const next = {};
      for (const [k, v] of Object.entries(prev)) {
        next[k] = { ...v, folders: (v.folders || []).filter((f) => f !== id) };
      }
      return next;
    });
  }, []);

  // --- Tags ---
  const createTag = useCallback((name, color = '#6ea8fe') => {
    const id = 't_' + Date.now();
    setTags((prev) => ({ ...prev, [id]: { id, name, color } }));
    return id;
  }, []);

  const deleteTag = useCallback((id) => {
    setTags((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // Remove tag from all favorites
    setFavorites((prev) => {
      const next = {};
      for (const [k, v] of Object.entries(prev)) {
        next[k] = { ...v, tags: (v.tags || []).filter((t) => t !== id) };
      }
      return next;
    });
  }, []);

  return {
    favorites, addFavorite, removeFavorite, updateNotes, updateFavorite,
    setCustomName, toggleFavoriteFolder, toggleFavoriteTag, isFavorite,
    folders, createFolder, renameFolder, deleteFolder,
    tags, createTag, deleteTag,
  };
}
