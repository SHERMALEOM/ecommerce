import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      alert("You need to login first to proceed to payment.");
      // Save intended path if we want, currently just redirect to login
      navigate("/login?redirect=cart");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container center-content">
        <h2 className="glass-title">Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <br />
        <Link to="/" className="glass-btn">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Shopping Cart</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="glass-card cart-item">
              <div className="cart-item-image">
                <img 
                  src={(item.images && item.images.length > 0) ? item.images[0] : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&q=80"} 
                  alt={item.title} 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&q=80" }}
                />
              </div>
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p>₹{item.price}</p>
                <div className="qty-controls" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                  <button className="glass-btn-small outline" style={{ padding: "0 8px", fontSize: "1.2rem", height: "28px" }} onClick={() => updateQuantity(item._id, 'dec')}>-</button>
                  <span style={{ fontSize: "1.1rem", fontWeight: "600", width: "20px", textAlign: "center" }}>{item.quantity}</span>
                  <button className="glass-btn-small outline" style={{ padding: "0 8px", fontSize: "1.2rem", height: "28px" }} onClick={() => updateQuantity(item._id, 'inc')}>+</button>
                </div>
              </div>
              <div className="cart-item-actions">
                <p className="item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  className="glass-btn-small outline danger"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary glass-card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr />
          <div className="summary-row font-bold">
            <span>Total</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
          
          <button 
            className="glass-btn full-width mt-4"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
