// src/components/sneakerList.jsx
import { useState } from 'react';
import './sneakerList.css';

function SneakerList({ sneakers, isAdmin, onUpdate, onDelete, cart, setCart }) {
  const [editingId, setEditingId] = useState(null);
  const [priceDraft, setPriceDraft] = useState('');
  const [invRows, setInvRows] = useState([]); // [{ size:'', qty:'', _delete:false }, ...]

  const canEdit = Boolean(isAdmin && typeof onUpdate === 'function');
  const canDelete = Boolean(isAdmin && typeof onDelete === 'function');

  const startEdit = (s) => {
    setEditingId(s.id);
    setPriceDraft(s.price ?? '');
    const prefilled = Array.isArray(s.inventory)
      ? s.inventory.map(it => ({ size: String(it.size ?? ''), qty: String(it.quantity ?? ''), _delete: false }))
      : [{ size: '', qty: '', _delete: false }];
    setInvRows(prefilled);
  };

  const cancelEdit = () => { setEditingId(null); setPriceDraft(''); setInvRows([]); };
  const addRow = () => setInvRows(prev => [...prev, { size: '', qty: '', _delete: false }]);
  const removeRow = (idx) => setInvRows(prev => prev.filter((_, i) => i !== idx));
  const editRow = (idx, field, value) =>
    setInvRows(prev => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  const toggleDelete = (idx) =>
    setInvRows(prev => prev.map((r, i) => (i === idx ? { ...r, _delete: !r._delete } : r)));

  const saveEdit = async (id) => {
    if (!canEdit) return;

    const patch = {};

    // Shoe fields
    if (priceDraft !== '' && !Number.isNaN(Number(priceDraft))) {
      patch.price = Number(priceDraft);
    }

    // Build inventory ops
    const inventory = invRows
      .map(r => {
        const size = Number(r.size);
        const qty  = Number(r.qty);
        if (!Number.isFinite(size)) return null;

        // If marked for delete, send the delete marker
        if (r._delete) return { size, delete: true };

        // Otherwise send an upsert if qty is a valid number
        if (Number.isFinite(qty)) return { size, quantity: qty };

        return null;
      })
      .filter(Boolean);

    if (inventory.length) patch.inventory = inventory;

    if (!Object.keys(patch).length) {
      alert('Nothing to update.');
      return;
    }

    await onUpdate(id, patch);
    cancelEdit();
  };


  return (
    <div className='sneakers_container'>
      {sneakers.map((s) => (
        <div key={s.id} className='sneaker_div'>
          <h3>{s.name}</h3>
          <p>{s.brand} — ${s.price}</p>
          {s.image && <img src={s.image} alt={s.name} width="150px" />}
          <button className='add-item' onClick={() => setCart(prevCart => [...prevCart, s])} >
              Add to Cart<p style={{color: "#00ff00ff"}}>+</p>
          </button>
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
                <input type="number" value={priceDraft} onChange={(e) => setPriceDraft(e.target.value)} />
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
                    disabled={row._delete}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={row.qty}
                    onChange={(e) => editRow(idx, 'qty', e.target.value)}
                    style={{ width: 90 }}
                    disabled={row._delete}
                  />
                  <button type="button" onClick={() => toggleDelete(idx)} style={{ color: row._delete ? 'red' : 'inherit' }}>
                    {row._delete ? 'Undo delete' : 'Delete size'}
                  </button>
                  <button type="button" onClick={() => removeRow(idx)}>Remove row</button>
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




