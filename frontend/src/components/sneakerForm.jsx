import { useState } from 'react';

function SneakerForm({ setSneakers }) {
  // Local form state
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    image: ''
  });

  // Handle input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Send POST request to backend
    const res = await fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const newSneaker = await res.json(); // Get new sneaker from server
    setSneakers(prev => [...prev, newSneaker]); // Spreads existing array into new array and appends it

    // Reset form
    setForm({ name: '', brand: '', price: '', image: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required type="number" />
      <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
      <button type="submit">Add Sneaker</button>
    </form>
  );
}

export default SneakerForm;