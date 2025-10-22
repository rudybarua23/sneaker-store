import { Link } from "react-router-dom";

export default function Hero(){
  return (
    <section className="section" style={{background:"linear-gradient(135deg, #ffd5c8 0%, #ff9a7a 100%)"}}>
      <div className="container" style={{display:"grid",gridTemplateColumns:"1.2fr .8fr",gap:"2rem",alignItems:"center"}}>
        <div>
          <h1 className="h1">Discover Your Style</h1>
          <p className="muted" style={{maxWidth:520}}>
            Explore the latest trends and shop your favorite products now.
          </p>
          <Link to="/shop" className="btn" style={{marginTop:"1rem"}}>Shop Now</Link>
        </div>
        <div>
          <img src="/images/hero.jpg" alt="Shopping" style={{borderRadius:"18px",boxShadow:"var(--shadow)"}}/>
        </div>
      </div>
    </section>
  )
}
