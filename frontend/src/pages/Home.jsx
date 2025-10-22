import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";

export default function Home({ featured = [], onAdd }){
  return (
    <>
      <Hero/>
      <section className="section">
        <div className="container">
          <h2 className="h2" style={{textAlign:"center"}}>Featured Products</h2>
          <ProductGrid products={featured} onAdd={onAdd}/>
        </div>
      </section>
    </>
  )
}
