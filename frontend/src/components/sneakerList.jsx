function SneakerList({ sneakers, isAdmin, setSneakers }) {
  // Delete sneaker by ID
  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'DELETE',
    });

    // Remove deleted sneaker from frontend state
    setSneakers(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div>
      {/* loops through the sneaker array and renders a block of html for each one*/}
      {sneakers.map(s => (
        <div key={s.id}>
          <h3>{s.name}</h3>
          <p>{s.brand} - ${s.price}</p>
          <img src={s.image} alt={s.name} width="150" />

          {/* Show delete button only for admin */}
          {isAdmin && (
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default SneakerList;