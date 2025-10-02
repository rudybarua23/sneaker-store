// App.jsx
import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import SneakerList from './components/sneakerList';   // adjust path/case if needed
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
export default function App() {
  const [sneakers, setSneakers] = useState([]);
  const [token, setToken] = useState(null);     // ID token for API Gateway authorizer
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let alive = true;

    // Public list (no auth)
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/shoes`);
        if (!res.ok) throw new Error(`GET /shoes ${res.status}`);
        const data = await res.json();
        if (alive) setSneakers(data);
      } catch (err) {
        console.error('Failed to load sneakers:', err);
      }
    })();

    // Read Cognito session → ID token → admin groups
    (async () => {
      try {
        const { tokens } = await fetchAuthSession();
        const id = tokens?.idToken?.toString();
        if (!id || !alive) return; // not signed in yet
        setToken(id);

        const payload = id.split('.')[1] || '';
        const claims = JSON.parse(atob(payload));
        const groups = claims?.['cognito:groups'] || [];
        const admin = Array.isArray(groups)
          ? groups.includes('admin')
          : String(groups).includes('admin');
        setIsAdmin(admin);

        if (import.meta.env.DEV) {
          window.__ID_TOKEN__ = id;           // dev helper
          console.log('ID token present, len =', id.length);
        }
      } catch {
        // not signed in yet; LoginComp will trigger Hosted UI
      }
    })();

    return () => { alive = false; };
  }, []);

  return (
    <div>
      <div id="navBar" style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent: 'space-between', width: '98vw', position: 'fixed', top: '0',padding: '1vw', paddingTop: '1vh', paddingBottom: '1vh', backgroundColor: "rgba(106, 148, 165, 1)"}}>
        <LoginComp/>
        <Cart cart={cart} setCart={setCart}/>
      <div id="loginPanel">
        <LoginComp />
      </div>

      <h1>Sneaker Catalog</h1>

      <SneakerList
        sneakers={sneakers}
        isAdmin={isAdmin}
        setSneakers={setSneakers}
        token={token}          // DELETE uses this
      />

      {isAdmin ? (
        <>
          <h2>Add New Sneaker</h2>
          <SneakerForm setSneakers={setSneakers} token={token} />  {/* POST uses this */}
        </>
      ) : (
        <p style={{ opacity: 0.7 }}>Sign in as an admin to add or delete sneakers.</p>
      )}
    </div>
  );
}
