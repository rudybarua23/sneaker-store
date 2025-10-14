// App.jsx
import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import SneakerList from './components/sneakerList';
import LoginComp from './components/LoginComp';
import Cart from './components/Cart';
import './App.css'
import './components/Cart.css';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [sneakers, setSneakers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const [cart, setCart] = useState([
    { id: 1, name: 'Air Force Juans', price: 499, image: 'https://134087839.cdn6.editmysite.com/uploads/1/3/4/0/134087839/W6FSZXNQ42EQV7K6AWN2EZLY.jpeg' },
    { id: 2, name: 'Simpson`s Xtreme', price: 699, image: 'https://m.media-amazon.com/images/I/81oC+oPXEdL._UY300_.jpg' },
    { id: 3, name: 'Nike SB Dunk Low Ms. Pacman Mens', price: 799, image: 'https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/000/846/991/original/2.jpg?action=crop&width=750' },
  ]);

  useEffect(() => {
    let alive = true;

    // Public list
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

    // Auth flags (no token in state)
    (async () => {
      try {
        const s = await fetchAuthSession(); // refreshes if needed
        const groups = s.tokens?.idToken?.payload?.['cognito:groups'] || [];
        const admin = Array.isArray(groups)
          ? groups.includes('admin')
          : String(groups || '').split(',').includes('admin');
        if (alive) setIsAdmin(admin);
      } catch {
        if (alive) setIsAdmin(false);
      } finally {
        if (alive) setAuthReady(true);
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
          {isAdmin && <Link to="/admin">Admin</Link>}
        </nav>
        <Cart cart={cart} setCart={setCart} />
      </div>

      <div style={{ height: 64 }} />

      <Routes>
        <Route
          path="/"
          element={
            <div className='main_cont'>
              <h1>Sneaker Catalog</h1>
              <SneakerList sneakers={sneakers} isAdmin={isAdmin} />
              {isAdmin && <p style={{opacity:.7}}>Go to the Admin page to add/edit shoes.</p>}
            </div>
          }
        />
        <Route
          path="/admin"
          element={
            !authReady ? <div>Loading…</div>
            : isAdmin ? <AdminPage isAdmin={isAdmin} />
            : <Navigate to="/" replace />
          }
        />
      </Routes>
    </div>
  );
}


