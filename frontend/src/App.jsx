// App.jsx
import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Routes, Route, Link } from 'react-router-dom';
import SneakerList from './components/sneakerList';
import SneakerForm from './components/sneakerForm';
import LoginComp from './components/LoginComp';
import Cart from './components/Cart';
import './App.css'
import './components/Cart.css';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [sneakers, setSneakers] = useState([]);
  const [token, setToken] = useState(null);   // ID token for API Gateway authorizer
  const [isAdmin, setIsAdmin] = useState(false);

  const [cart, setCart] = useState([
    { id: 1, name: 'Air Force Juans', price: 499, image: 'https://134087839.cdn6.editmysite.com/uploads/1/3/4/0/134087839/W6FSZXNQ42EQV7K6AWN2EZLY.jpeg' },
    { id: 2, name: 'Simpson`s Xtreme', price: 699, image: 'https://m.media-amazon.com/images/I/81oC+oPXEdL._UY300_.jpg' },
    { id: 3, name: 'Nike SB Dunk Low Ms. Pacman Mens', price: 799, image: 'https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/000/846/991/original/2.jpg?action=crop&width=750' },
  ]);

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
        const admin = Array.isArray(groups) ? groups.includes('admin') : String(groups).includes('admin');
        setIsAdmin(admin);

        if (import.meta.env.DEV) {
          window.__ID_TOKEN__ = id; // dev helper
          console.log('ID token present, len =', id.length);
        }
      } catch {
        // not signed in yet; LoginComp can trigger Hosted UI
      }
    })();

    return () => { alive = false; };
  }, []);

  return (
    <div>
      {/* Top navbar with Login + Cart */}
      <div id="navBar">
        <LoginComp />
        {/* simple nav to reach Admin */}
        <nav>
          <Link to="/">Catalog</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        <Cart cart={cart} setCart={setCart} />
      </div>

      {/* offset page content if navbar is fixed */}
      <div style={{ height: 64 }} />



      <Routes>
        <Route
          path="/"
          element={
            <div className='main_cont'>
              <h1>Sneaker Catalog</h1>
              <SneakerList
                sneakers={sneakers}
                isAdmin={isAdmin}
                cart={cart}
                setCart={setCart}
                // no onUpdate/onDelete ⇒ edit/delete hidden in catalog view
              />
              {isAdmin ? (
                <>
                  <h2>Add New Sneaker</h2>
                  <SneakerForm setSneakers={setSneakers} token={token} />
                </>
              ) : (
                <p style={{ opacity: 0.7 }}>
                  Sign in as an admin to add or delete sneakers.
                </p>
              )}
            </div>
          }
        />
        <Route
          path="/admin"
          element={<AdminPage token={token} isAdmin={isAdmin} />}
        />
      </Routes>
    </div>
  );
}

