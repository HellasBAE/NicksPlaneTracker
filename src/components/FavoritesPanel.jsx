import { useState } from 'react';

export default function FavoritesPanel({ favorites, nearbyIcaos, onUpdateNotes, onRemove, onClose }) {
  const [editingId, setEditingId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const favList = Object.values(favorites);

  const startEdit = (fav) => {
    setEditingId(fav.icao24);
    setNoteText(fav.notes);
  };

  const saveNote = (icao24) => {
    onUpdateNotes(icao24, noteText);
    setEditingId(null);
  };

  if (favList.length === 0) {
    return (
      <div className="favorites-panel">
        <div className="favorites-header">
          <h2>Tracked Planes</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <p className="favorites-empty">
          No tracked planes yet. Click a plane on the map and hit "Track" to add it here.
        </p>
      </div>
    );
  }

  return (
    <div className="favorites-panel">
      <div className="favorites-header">
        <h2>Tracked Planes ({favList.length})</h2>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="favorites-list">
        {favList.map((fav) => {
          const isNearby = nearbyIcaos.has(fav.icao24);
          return (
            <div key={fav.icao24} className={`favorite-item ${isNearby ? 'nearby' : ''}`}>
              <div className="favorite-main">
                <div className="favorite-info">
                  <strong>{fav.callsign || fav.icao24}</strong>
                  {isNearby && <span className="nearby-badge">NEARBY</span>}
                  {fav.airline && <div className="favorite-detail">{fav.airline}</div>}
                  {fav.aircraftType && <div className="favorite-detail">{fav.aircraftType}</div>}
                  {fav.registration && <div className="favorite-detail">Reg: {fav.registration}</div>}
                </div>
                <button onClick={() => onRemove(fav.icao24)} className="remove-btn" title="Untrack">
                  &times;
                </button>
              </div>

              {editingId === fav.icao24 ? (
                <div className="favorite-notes-edit">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add notes..."
                    rows={2}
                  />
                  <div className="note-actions">
                    <button onClick={() => saveNote(fav.icao24)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="favorite-notes" onClick={() => startEdit(fav)}>
                  {fav.notes || <span className="note-placeholder">Click to add notes...</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
