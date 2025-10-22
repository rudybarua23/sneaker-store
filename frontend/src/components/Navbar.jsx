import { Link, NavLink } from "react-router-dom";
import { useMemo } from "react";
import LoginComp from './LoginComp';

export default function Navbar({ cartItems = [], onSearch, isAdmin = false, authReady = true }) {
  const count = useMemo(
    () => cartItems.reduce((sum, it) => sum + (it.qty || 1), 0),
    [cartItems]
  );

  return (
    <header style={{position:"sticky",top:0,background:"#fff",zIndex:50,boxShadow:"0 2px 14px rgba(0,0,0,.04)"}}>
      <div className="container" style={{display:"flex",alignItems:"center",gap:"1rem",height:"64px"}}>
        <Link to="/" style={{fontWeight:800,color:"#ff6b4a"}}>RB.Shop</Link>
        
        <div className="container" style={{display:'flex',justifyContent:'flex-end',paddingTop:8}}>
            <LoginComp />
        </div>

        <nav style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"1rem"}}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          {authReady && isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <form onSubmit={(e)=>e.preventDefault()} style={{marginLeft:"1rem"}}>
          <input className="input" placeholder="Search products…" onChange={(e)=>onSearch?.(e.target.value)} style={{width:220}}/>
        </form>

        <Link to="/cart" style={{marginLeft:"1rem",position:"relative"}}>
          🛒
          {count > 0 && (
            <span style={{
              position:"absolute",top:-8,right:-10,background:"#ff6b4a",color:"#fff",
              borderRadius:"999px",fontSize:12,padding:"2px 6px",fontWeight:700
            }}>{count}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
