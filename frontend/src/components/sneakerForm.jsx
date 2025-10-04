// src/components/SneakerForm.jsx
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function SneakerForm({ setSneakers, token }) {
  // 👇 only change: add "quantity" to your existing state
  const [form, setForm] = useState({ name: '', brand: '', price: '', size: '', quantity: '', image: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (!token) throw new Error('You must be signed in as admin.');

      // Build payload: keep your original fields, but also add inventory
      const payload = {
        name: form.name,
        brand: form.brand,
        price: Number(form.price),
        image: form.image,
        // keep your old "size" shape for backward-compat if you want:
        size: Number(form.size),
      };

      // If size is provided, also send inventory with quantity (defaults to 1)
      const sizeNum = Number(form.size);
      const qtyNum = form.quantity === '' ? 1 : Number(form.quantity);
      if (Number.isFinite(sizeNum)) {
        payload.inventory = [{ size: sizeNum, quantity: Number.isFinite(qtyNum) ? qtyNum : 1 }];
      }

      const res = await fetch(`${API_BASE}/shoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Add failed: ${res.status} ${await res.text()}`);
      const newSneaker = await res.json();

      setSneakers((prev) => [...prev, newSneaker]);
      setForm({ name: '', brand: '', price: '', size: '', quantity: '', image: '' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
      <input name="size" type="number" placeholder="Size" value={form.size} onChange={handleChange} required />

      {/* 👇 new field for stock */}
      <input
        name="quantity"
        type="number"
        min="0"
        placeholder="Quantity (default 1)"
        value={form.quantity}
        onChange={handleChange}
      />

      <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
      <button type="submit" disabled={submitting}>{submitting ? 'Adding…' : 'Add Sneaker'}</button>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
    </form>
  );
}

