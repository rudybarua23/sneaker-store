// src/components/sneakerList.jsx
import { useState } from 'react';

function SneakerList({ sneakers, isAdmin, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [priceDraft, setPriceDraft] = useState('');
  const [invRows, setInvRows] = useState([]); // [{ size:'', qty:'' }, ...]

  const canEdit = Boolean(isAdmin && typeof onUpdate === 'function');
  const canDelete = Boolean(isAdmin && typeof onDelete === 'function');

  const startEdit = (s) => {
    setEditingId(s.id);
    setPriceDraft(s.price ?? '');

    // If your GET /shoes returns inventory, prefill it; otherwise start empty
    const prefilled =
      Array.isArray(s.inventory)
        ? s.inventory.map(it => ({ size: String(it.size ?? ''), qty: String(it.quantity ?? '') }))
        : [{ size: '', qty: '' }];
    setInvRows(prefilled);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPriceDraft('');
    setInvRows([]);
  };

  const addRow = () => setInvRows(prev => [...prev, { size: '', qty: '' }]);
  const removeRow = (idx) => setInvRows(prev => prev.filter((_, i) => i !== idx));
  const editRow = (idx, field, value) =>
    setInvRows(prev => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));

  const saveEdit = async (id) => {
    if (!canEdit) return;

    const patch = {};

    // Shoe fields
    if (priceDraft !== '' && !Number.isNaN(Number(priceDraft))) {
      patch.price = Number(priceDraft);
    }

    // Collect multiple sizes if provided
    const inventory = invRows
      .map(r => ({
        size: Number(r.size),
        quantity: Number(r.qty),
      }))
      .filter(r => !Number.isNaN(r.size) && !Number.isNaN(r.quantity));

    if (inventory.length) {
      patch.inventory = inventory;
      // >1 rows ⇒ AdminPage.onUpdate will do PUT (full replace)
      // 1 row  ⇒ AdminPage.onUpdate will do PATCH (single-size update)
    }

    if (!Object.keys(patch).length) {
      alert('Nothing to update.');
      return;
    }

    await onUpdate(id, patch);
    cancelEdit();
  };

  return (
    <div>
      {sneakers.map((s) => (
        <div key={s.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
          <h3>{s.name}</h3>
          <p>{s.brand} — ${s.price}</p>
          {s.image && <img src={s.image} alt={s.name} width="150" />}

          {canEdit && editingId !== s.id && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => startEdit(s)}>Edit</button>
              {canDelete && <button onClick={() => onDelete(s.id)}>Delete</button>}
            </div>
          )}

          {canEdit && editingId === s.id && (
            <div style={{ display: 'grid', gap: 8, marginTop: 8, background: '#fafafa', padding: 8 }}>
              <label>
                Price:&nbsp;
                <input
                  type="number"
                  value={priceDraft}
                  onChange={(e) => setPriceDraft(e.target.value)}
                />
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>Inventory (size / qty)</strong>
                <button type="button" onClick={addRow}>+ Add size</button>
              </div>

              {invRows.map((row, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Size"
                    value={row.size}
                    onChange={(e) => editRow(idx, 'size', e.target.value)}
                    style={{ width: 90 }}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={row.qty}
                    onChange={(e) => editRow(idx, 'qty', e.target.value)}
                    style={{ width: 90 }}
                  />
                  <button type="button" onClick={() => removeRow(idx)}>Remove</button>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => saveEdit(s.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SneakerList;



