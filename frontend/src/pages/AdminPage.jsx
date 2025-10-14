// src/pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import SneakerForm from '../components/sneakerForm';
import SneakerList from '../components/sneakerList';
import { authFetch } from '../lib/authFetch';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminPage({ isAdmin }) {
  const [sneakers, setSneakers] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/shoes`); // public endpoint
        if (!res.ok) throw new Error(`GET /shoes ${res.status}`);
        const data = await res.json();
        if (alive) setSneakers(data);
      } catch (e) {
        console.error('GET /shoes failed', e);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!isAdmin) {
    return (
      <div>
        <h1>Admin Panel</h1>
        <p>You must sign in as an admin to manage sneakers.</p>
      </div>
    );
  }

  async function reload() {
    try {
      const res = await fetch(`${API_BASE}/shoes`);
      if (res.ok) setSneakers(await res.json());
    } catch {}
  }

  async function onUpdate(id, patch) {
    setStatus('');
    try {
      const hasInv = Array.isArray(patch.inventory);
      const hasShoeFields = ['name', 'brand', 'price', 'image'].some(k => patch[k] !== undefined);

      // 1) Update shoe fields via PUT (no inventory in this call)
      if (hasShoeFields) {
        const body = { ...patch };
        delete body.inventory;
        if (Object.keys(body).length) {
          const res = await authFetch(`${API_BASE}/shoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error(`PUT failed: ${res.status} ${await res.text()}`);
          const updated = await res.json();
          setSneakers(prev => prev.map(s => (String(s.id) === String(id) ? { ...s, ...updated } : s)));
        }
      }

      // 2) Inventory edits
      if (hasInv) {
        // treat { size, delete:true } OR { size, quantity:null } as deletes
        const hasDelete = patch.inventory.some(
          it => it && (it.delete === true || it.quantity == null)
        );

        // normalize sizes/quantities to numbers (optional but nice)
        const invNormalized = patch.inventory.map(it => ({
          ...(it || {}),
          size: Number(it?.size),
          quantity: it?.quantity != null ? Number(it.quantity) : it?.quantity, // keep null for delete
        }));

        if (!hasDelete &&
            invNormalized.length === 1 &&
            invNormalized[0].quantity !== undefined &&
            invNormalized[0].quantity !== null &&
            !Number.isNaN(invNormalized[0].size) &&
            !Number.isNaN(invNormalized[0].quantity)) {
          // Single size, normal qty update → PATCH
          const { size, quantity, delta } = invNormalized[0];
          const payload = (quantity !== undefined)
            ? { size, quantity }
            : { size, delta: Number(delta) };

          const res = await authFetch(`${API_BASE}/shoes/${id}/inventory`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`PATCH inventory failed: ${res.status} ${await res.text()}`);
        } else {
          // Any delete present OR multiple rows → PUT merge (upsert + per-size delete)
          const res = await authFetch(`${API_BASE}/shoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inventory: invNormalized }),
          });
          if (!res.ok) throw new Error(`PUT inventory failed: ${res.status} ${await res.text()}`);
        }
      }

      setStatus('✅ Updated');
      // optionally refresh the list if your UI shows inventory details
      await reload();
    } catch (e) {
      console.error(e);
      setStatus(`❌ ${e.message}`);
    }
  }

  async function onDelete(id) {
    setStatus('');
    try {
      const res = await authFetch(`${API_BASE}/shoes/${id}`, { method: 'DELETE' });
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
        {/* remove token prop elsewhere too */}
        <SneakerForm setSneakers={setSneakers} />
      </section>

      <section>
        <h2>Current Sneakers</h2>
        <SneakerList
          sneakers={sneakers}
          isAdmin={isAdmin}
          setSneakers={setSneakers}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </section>

      {status && <div>{status}</div>}
    </div>
  );
}





