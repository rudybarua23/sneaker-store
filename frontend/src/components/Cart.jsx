// src/components/LoginComp.jsx
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
                    <h2>My Cart</h2>
                    {cart.length === 0 ? (
                        <p className="empty-cart">Geek, your cart is empty.</p>
                    ) : (
                        <div id='cart-dropdown'>
                            <h1>Cart:</h1>
                                <ul>
                                    {cart.map((item) => (
                                        <li key={item.id} className="cart-item">
                                            {console.log(item)}
                                            <div className="item-info">
                                                <div className="item-image">
                                                    <img src={item.image} 
                                                        alt={item.name} />
                                                </div>
                                                <div className="item-details">
                                                    <h3>{item.name}</h3>
                                                    <p>Price: ${item.price}</p>
                                                </div>
                                            </div>
                                                                    {/* Example remove button */}
                                            <button className='remove-item' onClick={() => setCart((prev) => prev.filter((i) => i.id !== item.id))}>
                                                X
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                        </div>
                    )}
                </div>
            
        )}
    </>

  );
}

export default Cart;