// src/pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import { signOut } from 'aws-amplify/auth';
import SneakerForm from '../components/sneakerForm';
import SneakerList from '../components/sneakerList';
const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminPage({ token, isAdmin }) {
  const [sneakers, setSneakers] = useState([]);
  const [status, setStatus] = useState('');

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

  if (!token) return <div><h1>Admin Panel</h1><p>You must sign in to manage sneakers.</p></div>;
  if (!isAdmin) {
    return (
      <div>
        <h1>Admin Panel</h1>
        <p>You’re signed in but not an admin.</p>
        <button onClick={() => signOut({ global: true }).then(() => window.location.assign('/'))}>
          Sign out
        </button>
      </div>
    );
  }

  async function onUpdate(id, patch) {
    setStatus('');

    // helper to refresh after updates (optional)
    async function reload() {
      try {
        const res = await fetch(`${API_BASE}/shoes`);
        if (res.ok) setSneakers(await res.json());
      } catch {}
    }

    try {
      const hasInv = Array.isArray(patch.inventory);
      const hasShoeFields = ['name', 'brand', 'price', 'image'].some(k => patch[k] !== undefined);

      // 1) If there are shoe fields, send them via PUT (but do NOT include inventory here)
      if (hasShoeFields) {
        const body = { ...patch };
        delete body.inventory; // avoid accidental full replace
        if (Object.keys(body).length) {
          const res = await fetch(`${API_BASE}/shoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error(`PUT failed: ${res.status} ${await res.text()}`);
          const updated = await res.json();
          setSneakers(prev => prev.map(s => (String(s.id) === String(id) ? { ...s, ...updated } : s)));
        }
      }

      // 2) If inventory changes were provided, decide PATCH (single size) vs PUT (full replace)
      if (hasInv) {
        if (patch.inventory.length === 1) {
          // PATCH a single size’s quantity (surgical update, does not touch other sizes)
          const { size, quantity, delta } = patch.inventory[0] || {};
          const payload =
            quantity !== undefined
              ? { size: Number(size), quantity: Number(quantity) }
              : { size: Number(size), delta: Number(delta) };

          const res = await fetch(`${API_BASE}/shoes/${id}/inventory`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`PATCH inventory failed: ${res.status} ${await res.text()}`);

          // You can reload if you display inventory in the UI
          // await reload();
        } else {
          // Multiple sizes → full replace via PUT inventory
          const res = await fetch(`${API_BASE}/shoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ inventory: patch.inventory }),
          });
          if (!res.ok) throw new Error(`PUT inventory failed: ${res.status} ${await res.text()}`);
          // await reload();
        }
      }

      setStatus('✅ Updated');
    } catch (e) {
      console.error(e);
      setStatus(`❌ ${e.message}`);
    }
  }

  async function onDelete(id) {
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
        <SneakerForm setSneakers={setSneakers} token={token} />
      </section>

      <section>
        <h2>Current Sneakers</h2>
        <SneakerList
          sneakers={sneakers}
          isAdmin={isAdmin}
          setSneakers={setSneakers}
          token={token}
          onUpdate={onUpdate}
          onDelete={onDelete} 
        />
      </section>

      {status && <div>{status}</div>}

      <button onClick={() => signOut({ global: true }).then(() => window.location.assign('/'))}>
        Sign out
      </button>
    </div>
  );
}




