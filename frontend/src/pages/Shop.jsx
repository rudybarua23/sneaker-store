import { useMemo, useState } from "react";
import FiltersSidebar from "../components/FiltersSidebar";
import ProductGrid from "../components/ProductGrid";

export default function Shop({ products = [], onAdd }){
  const [selectedCats, setSelectedCats] = useState({});
  const [price, setPrice] = useState({min:"", max:""});

  const filtered = useMemo(()=>{
    return products.filter(p=>{
      const passCat = Object.values(selectedCats).some(Boolean)
        ? !!selectedCats[p.category]
        : true;
      const minOk = price.min ? p.price >= Number(price.min) : true;
      const maxOk = price.max ? p.price <= Number(price.max) : true;
      return passCat && minOk && maxOk;
    });
  }, [products, selectedCats, price]);

  const categories = Array.from(new Set(products.map(p=>p.category))).filter(Boolean);

  return (
    <section className="section">
      <div className="container" style={{display:"grid", gridTemplateColumns:"260px 1fr", gap:"1.5rem"}}>
        <FiltersSidebar
          categories={categories}
          selected={selectedCats}
          setSelected={setSelectedCats}
          price={price}
          setPrice={setPrice}
        />
        <ProductGrid products={filtered} onAdd={onAdd}/>
      </div>
    </section>
  )
}
