import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onAdd }){
  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))",
      gap:"1.25rem"
    }}>
      {products.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd}/>)}
    </div>
  )
}
