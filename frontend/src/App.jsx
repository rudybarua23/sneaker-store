import { useEffect, useState } from 'react';
import SneakerList from './components/sneakerList';
import SneakerForm from './components/sneakerForm';
import LoginComp from './components/LoginComp';

function App() {
  const [sneakers, setSneakers] = useState([]); // holds list of sneakers
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    async function fetchSneakers() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/shoes`);
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
      <div id = "loginPanel">
        <LoginComp/>
      </div>
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
