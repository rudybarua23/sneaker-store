export default function Cart({ items = [], onInc, onDec, onRemove }){
  const subtotal = items.reduce((s, it) => s + it.price * (it.qty || 1), 0);

  return (
    <section className="section">
      <div className="container" style={{display:"grid", gridTemplateColumns:"1fr 360px", gap:"1.5rem"}}>
        <div>
          <h2 className="h2">Your Shopping Cart</h2>
          <ul style={{listStyle:"none",padding:0,margin:0,display:"grid",gap:"1rem"}}>
            {items.map(it => (
              <li key={it.id} className="card" style={{padding:"1rem", display:"grid", gridTemplateColumns:"80px 1fr auto", gap:"1rem", alignItems:"center"}}>
                <div style={{border:"var(--card-border)", borderRadius:"12px", padding:"6px", display:"grid", placeItems:"center"}}>
                  <img src={it.image} alt={it.name} style={{height:60, objectFit:"contain"}}/>
                </div>
                <div>
                  <div style={{fontWeight:600}}>{it.name}</div>
                  <div className="muted">${it.price.toFixed(2)}</div>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <button className="btn" onClick={()=>onDec(it)} style={{padding:"6px 10px"}}>-</button>
                  <div style={{minWidth:28,textAlign:"center"}}>{it.qty || 1}</div>
                  <button className="btn" onClick={()=>onInc(it)} style={{padding:"6px 10px"}}>+</button>
                  <button onClick={()=>onRemove(it)} title="Remove" style={{marginLeft:8,background:"transparent",border:"none",cursor:"pointer",color:"#ef4444"}}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="card" style={{padding:"1rem", height:"fit-content"}}>
          <div className="h2" style={{fontSize:"1rem"}}>Order Summary</div>
          <div style={{display:"grid", gap:8, margin:"1rem 0"}}>
            <div style={{display:"flex", justifyContent:"space-between"}}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div style={{display:"flex", justifyContent:"space-between"}}><span>Shipping</span><span>Free</span></div>
            <hr/>
            <div style={{display:"flex", justifyContent:"space-between", fontWeight:700}}><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
          </div>
          <button className="btn" style={{width:"100%"}}>Proceed to Checkout</button>
        </aside>
      </div>
    </section>
  );
}
