import { useEffect, useState } from 'react';
import SneakerList from './components/sneakerList';
import SneakerForm from './components/sneakerForm';
import LoginComp from './components/LoginComp';
import Cart from './components/Cart'


function App() {
  const [sneakers, setSneakers] = useState([]); // holds list of sneakers
  const [isAdmin, setIsAdmin] = useState(true);
  const [cart, setCart] = useState([
		{ id: 1, 
		name: 'Air Force Juans', 
		price: 499, 
		image: 'https://134087839.cdn6.editmysite.com/uploads/1/3/4/0/134087839/W6FSZXNQ42EQV7K6AWN2EZLY.jpeg'
		},
		{ id: 2, 
		name: 'Simpson`s Xtreme', 
		price: 699, 
		image: 'https://m.media-amazon.com/images/I/81oC+oPXEdL._UY300_.jpg'
		},
		{ id: 3, 
		name: 'Nike SB Dunk Low Ms. Pacman Mens', 
		price: 799, 
		image: 'https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/000/846/991/original/2.jpg?action=crop&width=750'
		}
	]); // holds list of sneakers in cart.

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
      <div id="navBar" style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent: 'space-between', width: '98vw', position: 'fixed', top: '0',padding: '1vw', paddingTop: '1vh', paddingBottom: '1vh', backgroundColor: "rgba(106, 148, 165, 1)"}}>
        <LoginComp/>
        <Cart cart={cart} setCart={setCart}/>
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
