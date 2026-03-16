import { useState } from 'react';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [username, setUsername] = useState(settings.openskyUsername || '');
  const [password, setPassword] = useState(settings.openskyPassword || '');
  const [pollSec, setPollSec] = useState(settings.pollInterval / 1000);

  const handleSave = () => {
    onSave({
      openskyUsername: username.trim(),
      openskyPassword: password,
      pollInterval: Math.max(5, Math.min(300, pollSec)) * 1000,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="modal-body">
          <section className="settings-section">
            <h3>Poll Interval</h3>
            <p className="settings-hint">
              How often to fetch new plane data. Lower = more updates but uses API quota faster.
            </p>
            <div className="settings-row">
              <input
                type="number"
                min="5"
                max="300"
                value={pollSec}
                onChange={(e) => setPollSec(Number(e.target.value))}
                className="settings-input-num"
              />
              <span>seconds</span>
            </div>
          </section>

          <section className="settings-section">
            <h3>OpenSky Network Credentials</h3>
            <p className="settings-hint">
              Anonymous users are limited to ~100 API calls/day (~1 every 10s).
              With a <strong>free</strong> account you get ~4,000 calls/day (~1 every 5s).
            </p>
            <ol className="settings-steps">
              <li>Go to <a href="https://opensky-network.org/index.php/-/login" target="_blank" rel="noopener noreferrer">opensky-network.org</a> and create a free account</li>
              <li>Confirm your email</li>
              <li>Enter your username and password below</li>
            </ol>
            <div className="settings-field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="OpenSky username"
                autoComplete="username"
              />
            </div>
            <div className="settings-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="OpenSky password"
                autoComplete="current-password"
              />
            </div>
            <p className="settings-hint" style={{ marginTop: 8 }}>
              Credentials are stored in your browser's localStorage only — never sent anywhere except OpenSky's API.
            </p>
          </section>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
}
