function SneakerList({ sneakers, isAdmin, setSneakers, token }) {
  const API_BASE = import.meta.env.VITE_API_BASE;

  const handleDelete = async (id) => {
    try {
      if (!token) throw new Error('No auth token yet');
      const res = await fetch(`${API_BASE}/shoes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(`DELETE /shoes/${id} failed: ${res.status} ${msg}`);
      }

      setSneakers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div>
      {sneakers.map(s => (
        <div key={s.id}>
          <h3>{s.name}</h3>
          <p>{s.brand} - ${s.price}</p>
          <img src={s.image} alt={s.name} width="150" />
          {isAdmin && <button onClick={() => handleDelete(s.id)} disabled={!token}>Delete</button>}
        </div>
      ))}
    </div>
  );
}

export default SneakerList;
