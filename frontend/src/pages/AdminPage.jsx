// src/pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import { signInWithRedirect, fetchAuthSession, signOut } from 'aws-amplify/auth';
import SneakerForm from './components/SneakerForm'; // adjust path/case
const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [claims, setClaims] = useState(null);
  const [sneakers, setSneakers] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Get tokens from Amplify v6
        const { tokens } = await fetchAuthSession();
        const accessToken = tokens?.accessToken?.toString(); 
        const idToken = tokens?.idToken?.toString();         // JWT string
        if (!idToken) throw new Error('No session');
        const decoded = JSON.parse(atob(idToken.split('.')[1])); // claims
        if (!mounted) return;
        setToken(idToken);
        setClaims(decoded);
        setLoading(false);
        window.__ID_TOKEN__ = idToken;              // so you can copy it
        console.log('ID_TOKEN for API GW test:', idToken);  // dev-only
      } catch (e) {
        // Not signed in → go to Hosted UI (includes "Sign up")
        setLoading(false);
        await signInWithRedirect({ provider: 'COGNITO' });
      }
    })();

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/shoes`);
        if (!res.ok) throw new Error('Failed to fetch shoes');
        const data = await res.json();
        if (mounted) setSneakers(data);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading session…</div>;

  const groups = claims?.['cognito:groups'] || [];
  const isAdmin = Array.isArray(groups) ? groups.includes('admin') : String(groups).includes('admin');

  if (!isAdmin) {
    return (
      <div>
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
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      setStatus('✅ Updated');
    } catch (e) {
      setStatus(`❌ ${e.message}`);
    }
  }

  async function deleteShoe(id) {
    setStatus('');
    try { 
      console.log("access token: ", token)
      const res = await fetch(`${API_BASE}/shoes/${id}`, 
        {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
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
                  <button onClick={() => updateShoe(s.id, { price: Number(s.price) + 1 })}>+$1</button>{' '}
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


