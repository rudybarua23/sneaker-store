function SneakerList({ sneakers, isAdmin, setSneakers, getToken }) {
  const API_BASE = import.meta.env.VITE_API_BASE;

  const handleDelete = async (id) => {
    try {
      const token = getToken ? await getToken() : null; // e.g., from Cognito
      const res = await fetch(`${API_BASE}/shoes/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
          {isAdmin && <button onClick={() => handleDelete(s.id)}>Delete</button>}
        </div>
      ))}
    </div>
  );
}

export default SneakerList;
