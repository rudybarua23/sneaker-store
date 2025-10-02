// src/pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import { signOut } from 'aws-amplify/auth';
import SneakerForm from '../components/sneakerForm'; // <-- adjust to your actual path/case
const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminPage({ token, isAdmin }) {
  const [sneakers, setSneakers] = useState([]);
  const [status, setStatus] = useState('');

  // Public GET (no auth required)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/shoes`);
        if (res.ok) {
          const data = await res.json();
          if (alive) setSneakers(data);
        }
      } catch (e) {
        console.error('GET /shoes failed', e);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Guard UI
  if (!token) {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <h1>Admin Panel</h1>
        <p>You must sign in to manage sneakers.</p>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <h1>Admin Panel</h1>
        <p>You’re signed in but not an admin.</p>
        <button onClick={() => signOut({ global: true }).then(() => window.location.assign('/'))}>
          Sign out
        </button>
      </div>
    );
  }

  async function updateShoe(id, patch) {
    setStatus('');
    try {
      const res = await fetch(`${API_BASE}/shoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status} ${await res.text()}`);
      setStatus('✅ Updated');
      // optionally refresh list here
    } catch (e) {
      setStatus(`❌ ${e.message}`);
    }
  }

  async function deleteShoe(id) {
    setStatus('');
    try {
      const res = await fetch(`${API_BASE}/shoes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status} ${await res.text()}`);
      setSneakers(prev => prev.filter(s => String(s.id) !== String(id)));
      setStatus('🗑️ Deleted');
    } catch (e) {
      setStatus(`❌ ${e.message}`);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1>Admin Panel</h1>

      <section>
        <h2>Add a Sneaker</h2>
        {/* POST uses token */}
        <SneakerForm setSneakers={setSneakers} token={token} />
      </section>

      <section>
        <h2>Current Sneakers</h2>
        <ul>
          {sneakers.map(s => (
            <li key={s.id || `${s.name}-${s.size}`}>
              {s.name} — {s.brand} — ${s.price} — size {s.size}{' '}
              {s.id && (
                <>
                  {' '}|{' '}
                  <button onClick={() => updateShoe(s.id, { price: Number(s.price) + 1 })}>
                    +$1
                  </button>{' '}
                  <button onClick={() => deleteShoe(s.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      {status && <div>{status}</div>}

      <button onClick={() => signOut({ global: true }).then(() => window.location.assign('/'))}>
        Sign out
      </button>
    </div>
  );
}



