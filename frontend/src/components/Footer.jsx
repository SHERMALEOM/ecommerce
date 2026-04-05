import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="glass-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="navbar-logo">
            Eco<span className="text-highlight">Store</span>
          </Link>
          <p className="footer-tagline">Premium E-Commerce Experience</p>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
        
        <div className="footer-right">
          <div className="footer-developer">
            <p>Developed by <strong>Shermale Om</strong></p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EcoStore. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
