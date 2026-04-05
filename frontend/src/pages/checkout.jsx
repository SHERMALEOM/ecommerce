import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { createOrder } from "../sevices/apiService";

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=cart");
    }
    if (cartItems.length === 0 && !success) {
      navigate("/cart");
    }
  }, [isAuthenticated, cartItems.length, navigate, success]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mimic processing delay
    setTimeout(async () => {
      // Create backend format
      const orderData = {
        products: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        totalPrice: getCartTotal(),
      };

      const res = await createOrder(orderData);

      if (res.success) {
        setSuccess(true);
        clearCart();
        setLoading(false);
      } else {
        setError(res.message || "Failed to process payment. Please try again.");
        setLoading(false);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div className="container center-content">
        <div className="glass-panel" style={{ maxWidth: "500px" }}>
          <div className="success-icon" style={{ fontSize: "4rem", marginBottom: "20px" }}>✅</div>
          <h2 className="glass-title">Payment Successful!</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "30px" }}>
            Thank you for your purchase. Your order has been placed and is being processed.
          </p>
          <button className="glass-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container center-content">
      <div className="glass-panel" style={{ maxWidth: "800px", width: "100%", padding: "40px" }}>
        <h2 className="page-title" style={{ fontSize: "2rem", marginBottom: "30px" }}>Complete Payment</h2>
        
        <div className="checkout-layout">
          {/* Order Brief */}
          <div className="checkout-summary glass-card">
            <h3>Order Summary</h3>
            <p><strong>Total Items:</strong> {cartItems.reduce((a, b) => a + b.quantity, 0)}</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#e94560", marginTop: "15px" }}>
              Total: ₹{getCartTotal().toFixed(2)}
            </p>
            <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "20px 0" }} />
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
              🔒 Secured by EcoStore Payment Gateway
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form-container">
            {error && <div className="glass-alert error">{error}</div>}
            
            <form onSubmit={handlePayment} className="payment-form">
              <div className="glass-input-group">
                <label className="input-label">Cardholder Name</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>

              <div className="glass-input-group">
                <label className="input-label">Card Number</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="0000 0000 0000 0000"
                  maxLength="16"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <div className="glass-input-group" style={{ flex: 1 }}>
                  <label className="input-label">Expiry Date</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="glass-input-group" style={{ flex: 1 }}>
                  <label className="input-label">CVC / CVV</label>
                  <input
                    type="password"
                    className="glass-input"
                    placeholder="123"
                    maxLength="4"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="glass-btn full-width" disabled={loading} style={{ marginTop: "20px" }}>
                {loading ? "Processing Securely..." : `Pay ₹${getCartTotal().toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
