import { useState, useMemo } from 'react';

export default function FavoritesPanel({
  favorites, nearbyIcaos, folders, tags,
  onUpdateNotes, onRemove, onSetCustomName,
  onToggleFolder, onToggleTag,
  onCreateFolder, onRenameFolder, onDeleteFolder,
  onCreateTag, onDeleteTag,
  onFollowPlane, followingIcao,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | folder id
  const [editingId, setEditingId] = useState(null);
  const [editField, setEditField] = useState(null); // 'notes' | 'name'
  const [editText, setEditText] = useState('');
  const [showManage, setShowManage] = useState(null); // icao24 of plane being managed
  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6ea8fe');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [renamingFolder, setRenamingFolder] = useState(null);
  const [renameText, setRenameText] = useState('');
  const [confirmingUntrack, setConfirmingUntrack] = useState(null);

  const favList = useMemo(() => {
    const all = Object.values(favorites);
    if (activeTab === 'all') return all;
    return all.filter((f) => (f.folders || []).includes(activeTab));
  }, [favorites, activeTab]);

  const folderList = Object.values(folders);
  const tagList = Object.values(tags);

  const startEdit = (fav, field) => {
    setEditingId(fav.icao24);
    setEditField(field);
    setEditText(field === 'notes' ? (fav.notes || '') : (fav.customName || ''));
  };

  const saveEdit = (icao24) => {
    if (editField === 'notes') onUpdateNotes(icao24, editText);
    else onSetCustomName(icao24, editText);
    setEditingId(null);
    setEditField(null);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setShowCreateTag(false);
    }
  };

  const handleRenameFolder = (id) => {
    if (renameText.trim()) {
      onRenameFolder(id, renameText.trim());
      setRenamingFolder(null);
    }
  };

  const displayName = (fav) => fav.customName || fav.callsign || fav.icao24;

  return (
    <div className="favorites-panel">
      <div className="favorites-header">
        <h2>Tracked Planes ({Object.keys(favorites).length})</h2>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>

      {/* Folder tabs */}
      <div className="folder-tabs">
        <button
          className={`folder-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => { setActiveTab('all'); setShowManage(null); setConfirmingUntrack(null); }}
        >
          All
        </button>
        {folderList.map((folder) => (
          <button
            key={folder.id}
            className={`folder-tab ${activeTab === folder.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(folder.id); setShowManage(null); setConfirmingUntrack(null); }}
            onDoubleClick={() => { setRenamingFolder(folder.id); setRenameText(folder.name); }}
            title="Double-click to rename"
          >
            {renamingFolder === folder.id ? (
              <input
                className="folder-rename-input"
                value={renameText}
                onChange={(e) => setRenameText(e.target.value)}
                onBlur={() => handleRenameFolder(folder.id)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRenameFolder(folder.id); if (e.key === 'Escape') setRenamingFolder(null); }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                {folder.name}
                <span
                  className="folder-delete"
                  onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); if (activeTab === folder.id) setActiveTab('all'); }}
                  title="Delete folder"
                >
                  &times;
                </span>
              </>
            )}
          </button>
        ))}
        {showCreateFolder ? (
          <div className="folder-create-inline">
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setShowCreateFolder(false); }}
              autoFocus
            />
            <button onClick={handleCreateFolder}>+</button>
          </div>
        ) : (
          <button className="folder-tab add-folder" onClick={() => setShowCreateFolder(true)}>+</button>
        )}
      </div>

      {favList.length === 0 ? (
        <p className="favorites-empty">
          {activeTab === 'all'
            ? 'No tracked planes yet. Click a plane on the map and hit "Track".'
            : 'No planes in this folder.'}
        </p>
      ) : (
        <div className="favorites-list">
          {favList.map((fav) => {
            const isNearby = nearbyIcaos.has(fav.icao24);
            const isFollowing = followingIcao === fav.icao24;
            const favTags = (fav.tags || []).map((id) => tags[id]).filter(Boolean);

            return (
              <div key={fav.icao24} className={`favorite-item ${isNearby ? 'nearby' : ''} ${isFollowing ? 'following' : ''}`}>
                <div className="favorite-main">
                  <div className="favorite-info" style={{ flex: 1 }}>
                    <div className="favorite-title-row">
                      <strong
                        className={`favorite-name ${isNearby ? 'clickable' : ''}`}
                        onClick={() => isNearby && onFollowPlane(fav.icao24)}
                        title={isNearby ? 'Click to follow this plane' : ''}
                      >
                        {displayName(fav)}
                      </strong>
                      {isNearby && <span className="nearby-badge">NEARBY</span>}
                      {isFollowing && <span className="following-badge">FOLLOWING</span>}
                    </div>
                    {fav.customName && fav.callsign && (
                      <div className="favorite-detail">Callsign: {fav.callsign}</div>
                    )}
                    {fav.airline && <div className="favorite-detail">{fav.airline}</div>}
                    {fav.aircraftType && <div className="favorite-detail">{fav.aircraftType}</div>}
                    {fav.registration && <div className="favorite-detail">Reg: {fav.registration}</div>}

                    {/* Tags */}
                    {favTags.length > 0 && (
                      <div className="favorite-tags">
                        {favTags.map((t) => (
                          <span key={t.id} className="tag-pill" style={{ background: t.color + '33', color: t.color, borderColor: t.color }}>
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="favorite-actions">
                    <button onClick={() => setShowManage(showManage === fav.icao24 ? null : fav.icao24)} className="manage-btn" title="Manage">
                      ...
                    </button>
                  </div>
                </div>

                {/* Manage dropdown */}
                {showManage === fav.icao24 && (
                  <div className="manage-panel">
                    {/* Custom name */}
                    <div className="manage-section">
                      <label>Custom Name</label>
                      {editingId === fav.icao24 && editField === 'name' ? (
                        <div className="inline-edit">
                          <input value={editText} onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(fav.icao24); }} autoFocus />
                          <button onClick={() => saveEdit(fav.icao24)}>Save</button>
                        </div>
                      ) : (
                        <div className="manage-value clickable" onClick={() => startEdit(fav, 'name')}>
                          {fav.customName || <span className="note-placeholder">Add custom name...</span>}
                        </div>
                      )}
                    </div>

                    {/* Folders */}
                    <div className="manage-section">
                      <label>Folders</label>
                      <div className="manage-checkboxes">
                        {folderList.length === 0 && <span className="note-placeholder">No folders yet</span>}
                        {folderList.map((folder) => (
                          <label key={folder.id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={(fav.folders || []).includes(folder.id)}
                              onChange={() => onToggleFolder(fav.icao24, folder.id)}
                            />
                            {folder.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="manage-section">
                      <label>Tags</label>
                      <div className="manage-checkboxes">
                        {tagList.length === 0 && <span className="note-placeholder">No tags yet</span>}
                        {tagList.map((tag) => (
                          <label key={tag.id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={(fav.tags || []).includes(tag.id)}
                              onChange={() => onToggleTag(fav.icao24, tag.id)}
                            />
                            <span className="tag-dot" style={{ background: tag.color }}></span>
                            {tag.name}
                            <span className="tag-delete" onClick={(e) => { e.preventDefault(); onDeleteTag(tag.id); }}>&times;</span>
                          </label>
                        ))}
                        {showCreateTag ? (
                          <div className="tag-create-inline">
                            <input value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="Tag name" autoFocus
                              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateTag(); if (e.key === 'Escape') setShowCreateTag(false); }} />
                            <input type="color" value={newTagColor} onChange={(e) => setNewTagColor(e.target.value)} />
                            <button onClick={handleCreateTag}>Add</button>
                          </div>
                        ) : (
                          <button className="create-tag-btn" onClick={() => setShowCreateTag(true)}>+ New Tag</button>
                        )}
                      </div>
                    </div>

                    {/* Untrack with confirmation */}
                    <div className="manage-section untrack-section">
                      {confirmingUntrack === fav.icao24 ? (
                        <div className="untrack-confirm">
                          <span>Untrack this plane?</span>
                          <button className="untrack-yes" onClick={() => { onRemove(fav.icao24); setConfirmingUntrack(null); setShowManage(null); }}>Yes, Untrack</button>
                          <button className="untrack-no" onClick={() => setConfirmingUntrack(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button className="untrack-btn" onClick={() => setConfirmingUntrack(fav.icao24)}>Untrack Plane</button>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {editingId === fav.icao24 && editField === 'notes' ? (
                  <div className="favorite-notes-edit">
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} placeholder="Add notes..." rows={2} />
                    <div className="note-actions">
                      <button onClick={() => saveEdit(fav.icao24)}>Save</button>
                      <button onClick={() => { setEditingId(null); setEditField(null); }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="favorite-notes" onClick={() => startEdit(fav, 'notes')}>
                    {fav.notes || <span className="note-placeholder">Click to add notes...</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
