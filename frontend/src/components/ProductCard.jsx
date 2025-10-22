export default function ProductCard({ product, onAdd }){
  return (
    <div className="card" style={{padding:"1rem"}}>
      <div className="product-thumb"style={{border: "var(--card-border)", borderRadius:"12px", padding:"1rem", display:"grid", placeItems:"center"}}>
        <img src={product.image} alt={product.name} style={{height:250,objectFit:"contain"}}/>
      </div>
      <div style={{marginTop:"1rem"}}>
        <div style={{minHeight:48}}>{product.name}</div>
        <div style={{color:"#ef4444",fontWeight:700, margin:"6px 0"}}>${product.price.toFixed(2)}</div>
        <button className="btn add-btn" style={{width:"100%"}} onClick={()=>onAdd(product)}>Add to Cart</button>
      </div>
    </div>
  )
}
