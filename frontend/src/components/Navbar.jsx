import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { logout as logoutApi } from "../sevices/apiService"; 

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    // Optionally call backend logout API here if needed
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="glass-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Eco<span className="text-highlight">Store</span>
        </Link>
        
        <form onSubmit={handleSearch} className="nav-search-form">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="nav-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="glass-btn-small nav-search-btn">🔍</button>
        </form>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-link">
            Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          
          {isAuthenticated ? (
            <div className="nav-user-menu">
              {user?.role === 'admin' && <Link to="/admin" className="nav-link" style={{marginRight: '1rem', fontWeight: 'bold', color: '#ffb86c'}}>Admin</Link>}
              <span className="nav-username">Hi, {user?.firstname || user?.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="glass-btn-small outline">Logout</button>
            </div>
          ) : (
            <div className="nav-auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="glass-btn-small">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
