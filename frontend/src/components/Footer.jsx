export default function Footer() {
  return (
    <footer style={{background:"#0f0f10", color:"#d6d6d6", marginTop:"3rem"}}>
      <div className="container" style={{padding:"3rem 1rem"}}>
        {/* Newsletter panel */}
        <div style={{
          background:"#141416",
          border:"1px solid #222",
          borderRadius:"16px",
          padding:"2rem",
          maxWidth:1000,
          margin:"0 auto 2rem"
        }}>
          <h3 style={{color:"#fff", textAlign:"center", margin:"0 0 .5rem"}}>Join our newsletter & get 15% off</h3>
          <p style={{opacity:.8, textAlign:"center", margin:"0 0 1rem", color:"#fff"}}>
            Be the first to know about new arrivals, sales & exclusive offers.
          </p>
          <form onSubmit={(e)=>e.preventDefault()} style={{display:"flex", gap:12, justifyContent:"center"}}>
            <input
              className="input"
              placeholder="Enter your email"
              style={{width:320, background:"#0d0d0e", border:"1px solid #2a2a2a", color:"#fff"}}
            />
            <button className="btn" style={{background:"#111", color:"#fff", padding:".6rem 1rem", borderRadius:8}}>
              Subscribe
            </button>
          </form>
        </div>

        {/* Columns */}
        <div style={{display:"grid", gridTemplateColumns:"2fr repeat(3, 1fr)", gap:"2rem", alignItems:"start"}}>
          <div>
            <h2 style={{color:"#fff"}}>RB.Shop</h2>
            <p style={{opacity:.8, marginTop:8, color:"#fff"}}>Your one-stop shop for the best products at great prices.</p>
          </div>
          <div>
            <h4 style={{color:"#fff"}}>Company</h4>
            <ul className="footer-links">
              <li><a href="/about">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{color:"#fff"}}>Support</h4>
            <ul className="footer-links">
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Shipping</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{color:"#fff"}}>Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div style={{borderTop:"1px solid #1f1f1f", marginTop:"2rem", paddingTop:"1rem", textAlign:"center", opacity:.7}}>
          © {new Date().getFullYear()} RB.Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
