// src/components/SneakerForm.jsx
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function SneakerForm({ setSneakers, token }) {
  const [form, setForm] = useState({ name: '', brand: '', price: '', size: '', image: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (!token) throw new Error('You must be signed in as admin.');
      const res = await fetch(`${API_BASE}/shoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          brand: form.brand,
          price: Number(form.price),
          size: Number(form.size),
          image: form.image,
        }),
      });
      if (!res.ok) throw new Error(`Add failed: ${res.status} ${await res.text()}`);
      const newSneaker = await res.json();
      setSneakers((prev) => [...prev, newSneaker]);
      setForm({ name: '', brand: '', price: '', size: '', image: '' });
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
      <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
      <button type="submit" disabled={submitting}>{submitting ? 'Adding…' : 'Add Sneaker'}</button>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
    </form>
  );
}
