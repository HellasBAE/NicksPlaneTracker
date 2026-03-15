import { useState } from 'react';

export default function AddressInput({ onLocate, loading }) {
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) onLocate(address.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="address-input">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your home address..."
        disabled={loading}
      />
      <button type="submit" disabled={loading || !address.trim()}>
        {loading ? 'Locating...' : 'Locate'}
      </button>
    </form>
  );
}
