// src/App.jsx
import { useEffect, useMemo, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Routes, Route, Navigate } from 'react-router-dom';

import CartPage from './pages/Cart';         
import AdminPage from './pages/AdminPage';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Footer from './components/Footer';

import './App.css';
import './components/Cart.css';
import './styles/variables.css';

function DebugBar({ authReady, isAdmin, count }) {
  return (
    <div style={{position:'fixed',bottom:8,right:8,background:'#111',color:'#fff',
                 fontSize:12,padding:'6px 8px',borderRadius:8,opacity:.8,zIndex:9999}}>
      authReady: {String(authReady)} · isAdmin: {String(isAdmin)} · sneakers: {count}
    </div>
  );
}

export default function App() {
  const [sneakers, setSneakers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const handleCreateShoe = (created) => {
    // normalize shape + ensure price is a number
    const newItem = { ...created, price: Number(created.price ?? 0) };
    setSneakers(prev => [newItem, ...prev]); // or [...prev, newItem] if you want it at the end
  };

  const handleUpdateShoe = (id, patch) => {
    setSneakers(prev =>
      prev.map(s => String(s.id) === String(id) ? { ...s, ...patch } : s)
    );
  };

  const handleDeleteShoe = (id) => {
    setSneakers(prev => prev.filter(s => String(s.id) !== String(id)));
  };

  // cart state
  const [cart, setCart] = useState([]);

  // search state (for Navbar search + Shop filter)
  const [search, setSearch] = useState('');

  // ----- data fetch + auth -----
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/shoes`);
        if (!res.ok) throw new Error(`GET /shoes ${res.status}`);
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw.map(s => ({
          ...s,
          price: typeof s.price === 'number' ? s.price : Number(s.price ?? NaN),
        })) : [];
        if (alive) setSneakers(data);
      } catch (err) {
        console.error('Failed to load sneakers:', err);
      }
    })();

    (async () => {
      try {
        const s = await fetchAuthSession();
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


  // ----- cart handlers -----
  const handleAdd = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: (i.qty || 1) + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const incQty = (item) => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i));
  const decQty = (item) => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: Math.max(1, (i.qty || 1) - 1) } : i));
  const removeItem = (item) => setCart(prev => prev.filter(i => i.id !== item.id));

  // ----- filtering + featured -----
  const filteredBySearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sneakers;
    return sneakers.filter(s =>
      [s.name, s.brand, s.category]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    );
  }, [sneakers, search]);

  const featured = useMemo(() => filteredBySearch.slice(0, 6), [filteredBySearch]);

  return (
    <>
      {/* Top bar with brand, login, search, and cart badge */}
      <Navbar
        cartItems={cart}
        onSearch={setSearch}
        isAdmin={isAdmin}
        authReady={authReady}
      />

      <Routes>
        {/* Home with hero + featured */}
        <Route
          path="/"
          element={<Home featured={featured} onAdd={handleAdd} />}
        />

        {/* Shop with filters + grid (uses the filtered list and same add handler) */}
        <Route
          path="/shop"
          element={<Shop products={filteredBySearch} onAdd={handleAdd} />}
        />

        {/* Cart page */}
        <Route
          path="/cart"
          element={
            <CartPage
              items={cart}
              onInc={incQty}
              onDec={decQty}
              onRemove={removeItem}
            />
          }
        />
        
        {/* Admin protected */}
        <Route
          path="/admin"
          element={
            !authReady ? <div className="container">Loading…</div>
            : isAdmin ? (
              <AdminPage 
                isAdmin={isAdmin}
                sneakers={sneakers} 
                onCreateShoe={handleCreateShoe} 
                onUpdateShoe={handleUpdateShoe}
                onDeleteShoe={handleDeleteShoe}
              />
            )
            : <Navigate to="/" replace />
          }
        />
      </Routes>

      <Footer />

      <DebugBar authReady={authReady} isAdmin={isAdmin} count={sneakers.length} />
    </>
  );
}



