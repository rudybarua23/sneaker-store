import { useEffect, useState } from 'react';
import SneakerList from './components/SneakerList';
import SneakerForm from './components/SneakerForm';

function App() {
  const [sneakers, setSneakers] = useState([]); // holds list of sneakers
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    async function fetchSneakers() {
      try {
        const res = await fetch('http://localhost:3001/api/products');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json(); //parsed json into an array of sneakers
        setSneakers(data); // saves array to sneakers state
      } catch (err) {
        console.error('Failed to load sneakers:', err.message);
        // Show error message to user
      }
    }

    fetchSneakers(); // call the async function inside useEffect
  }, []);

  return (
    <div>
      <h1>Sneaker Catalog</h1>
      <SneakerList
        sneakers={sneakers}
        isAdmin={isAdmin}
        setSneakers={setSneakers}
      />
      {isAdmin && (
        <>
          <h2>Add New Sneaker</h2>
          <SneakerForm setSneakers={setSneakers} />
        </>
      )}
    </div>
  );
}

export default App;
