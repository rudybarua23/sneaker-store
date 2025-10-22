// src/pages/AdminPage.jsx
import { useState } from 'react';
import SneakerForm from '../components/sneakerForm';
import SneakerList from '../components/sneakerList';
import { authFetch } from '../lib/authFetch';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminPage({ isAdmin, sneakers = [], onCreateShoe, onUpdateShoe, onDeleteShoe }) {
  console.log('AdminPage sneakers:', sneakers);
  const [status, setStatus] = useState('');

  if (!isAdmin) {
    return (
      <div>
        <h1>Admin Panel</h1>
        <p>You must sign in as an admin to manage sneakers.</p>
      </div>
    );
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
          // reflect shoe-field changes in App state
          onUpdateShoe?.(id, updated);
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

        // After inventory mutation, fetch the fresh shoe and push it up to App
        try {
          const getRes = await fetch(`${API_BASE}/shoes/${id}`);
          if (getRes.ok) {
            const fresh = await getRes.json();
            onUpdateShoe?.(id, {
              ...fresh,
              price: typeof fresh.price === 'number' ? fresh.price : Number(fresh.price ?? 0),
            });
          }
        } catch (e) {
          console.warn('GET /shoes/:id after inventory update failed', e);
        }
      }

      setStatus('✅ Updated');
      // If you want to reflect inventory in UI, you can optionally refetch in App
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
      onDeleteShoe?.(id); // reflect in App state
      setStatus('🗑️ Deleted');
    } catch (e) {
      setStatus(`❌ ${e.message}`);
    }
  }

  return (
    <div style={{ display: 'flex',flexDirection: 'column', width: '100%', alignItems: 'stretch'}}>
      <h1>Admin Panel</h1>

      <section style={{ display: 'flex',flexDirection: 'column', width: '100%', alignItems: 'center'}}>
        <h2>Add a Sneaker</h2>
        {/* remove token prop elsewhere too */}
        <SneakerForm onCreate={onCreateShoe} style={{ width: '80%'}}/>
      </section>

      <section style={{ display: 'flex',flexDirection: 'column', width: '100%', alignItems: 'center'}}>
        <h2>Current Sneakers</h2>
        <SneakerList
          sneakers={sneakers}
          isAdmin={isAdmin}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </section>

      {status && <div>{status}</div>}
    </div>
  );
}





