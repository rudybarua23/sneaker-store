export default function FiltersSidebar({ categories = [], selected = {}, setSelected, price, setPrice }){
  return (
    <aside className="card" style={{padding:"1rem", position:"sticky", top:88, alignSelf:"start"}}>
      <div className="h2" style={{fontSize:"1rem"}}>Filters</div>

      <div style={{marginTop:"1rem"}}>
        <div className="muted" style={{fontWeight:600, marginBottom:8}}>Category</div>
        {categories.map(c => (
          <label key={c} style={{display:"block", marginBottom:6}}>
            <input
              type="checkbox"
              checked={!!selected[c]}
              onChange={(e)=>setSelected(s=>({...s, [c]: e.target.checked}))}
              style={{marginRight:8}}
            />
            {c}
          </label>
        ))}
      </div>

      <div style={{marginTop:"1rem"}}>
        <div className="muted" style={{fontWeight:600, marginBottom:8}}>Price</div>
        <div style={{display:"flex", gap:8}}>
          <input className="input" placeholder="Min" value={price.min ?? ""} onChange={(e)=>setPrice(p=>({...p, min:e.target.value}))}/>
          <input className="input" placeholder="Max" value={price.max ?? ""} onChange={(e)=>setPrice(p=>({...p, max:e.target.value}))}/>
        </div>
      </div>
    </aside>
  )
}
