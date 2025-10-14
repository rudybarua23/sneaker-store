import { useState } from 'react';
import './Cart.css'
function Cart({cart, setCart}) {
  const [showCart, toggleCart] = useState(false);
  return (
    <>
        <button id="cart-button" onClick={() => toggleCart(!showCart)}>
            Cart: ( {cart.length} items )
        </button>
        {showCart && (
                <div className={`cart ${cart.length > 0 ? 'active' : ''}`}>
                    <h1>Items:</h1>
                    {cart.length === 0 ? (
                        <p className="empty-cart">Cart is empty.</p>
                    ) : (
                        <div id='cart-dropdown'>
                                <ul>
                                    {cart.map((item) => (
                                        <li key={item.id} className="cart-item">
                                            <div className="item-info">
                                                <div className="item-image">
                                                    {item.image && <img src={item.image} alt={item.name} width="150px" />}
                                                </div>
                                                <div className="item-details">
                                                    <h3>{item.name}</h3>
                                                    <p>Price: ${item.price}</p>
                                                </div>
                                            </div>
                                                                 {/* Example remove button */}
                                            <button className='remove-item' onClick={() => setCart((prev) => prev.filter((i) => i.id !== item.id))} style={{color: "#ff0000"}}>
                                                X
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                        </div>
                    )}
                    <h2>Total: ${cart.reduce((total, item) => total + Number(item.price), 0.00)}</h2>
                </div>
            
        )}
    </>

  );
}

export default Cart;