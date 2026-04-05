import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const BASE_URL = "http://localhost:4000";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search")?.toLowerCase() || "";
    
    if (search) {
      setFilteredProducts(
        products.filter(
          (p) =>
            p.title?.toLowerCase().includes(search) ||
            p.description?.toLowerCase().includes(search) ||
            p.category?.toLowerCase().includes(search)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [location.search, products]);

  const handleAddToCart = (product, isInCart) => {
    if (isInCart) {
      removeFromCart(product._id);
    } else {
      addToCart(product);
    }
  };

  if (loading) return <div className="loader container center-content">Loading products...</div>;
  if (error) return <div className="glass-alert error container">Error: {error}</div>;

  const searchQuery = new URLSearchParams(location.search).get("search");

  return (
    <div className="container">
      <h1 className="page-title">{searchQuery ? `Search Results for "${searchQuery}"` : "Discover Our Products"}</h1>
      
      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="empty-state">No products found.</p>
        ) : (
          filteredProducts.map((product) => {
            const imageUrl = (product.images && product.images.length > 0) 
              ? product.images[0] 
              : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80";
              
            // Check if product is in cart persistently
            const isInCart = cartItems.some((item) => item._id === product._id);

            return (
              <div key={product._id} className="glass-card product-card">
                <div className="product-image">
                  <img 
                    src={imageUrl} 
                    alt={product.title} 
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" }}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
                    <button 
                      className={`glass-btn-small ${isInCart ? 'success' : ''}`}
                      onClick={() => handleAddToCart(product, isInCart)}
                    >
                      {isInCart ? "Added to Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Products;

