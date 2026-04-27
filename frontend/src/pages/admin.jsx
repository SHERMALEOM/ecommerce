import { useState, useEffect } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  createProduct,
  deleteProduct,
} from "../sevices/apiService";
import "../index.css"; // Ensure standard styles are applied

const BASE_URL = "http://localhost:4000";

function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  
  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Product Form State
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: 10,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"]
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      if (activeTab === "products") {
        const response = await fetch(`${BASE_URL}/product`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } else if (activeTab === "orders") {
        const data = await getAllOrders();
        if (data.success) {
          setOrders(data.orders || data.data || []);
        } else {
          throw new Error(data.message || "Failed to fetch orders");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PRODUCT HANDLERS ---
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await createProduct({ ...newProduct, price: Number(newProduct.price) });
      if (res.success) {
        setMessage("Product created successfully!");
        setNewProduct({
          title: "",
          description: "",
          price: "",
          category: "",
          stock: 10,
          images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"]
        });
        fetchData(); // Refresh list
      } else {
        throw new Error(res.message || "Failed to create product");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        setMessage("Product deleted successfully");
        fetchData();
      } else {
        throw new Error(res.message || "Failed to delete product");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // --- ORDER HANDLERS ---
  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      const res = await updateOrderStatus(id, { status: newStatus });
      if (res.success) {
        setMessage(`Order ${id} status updated to ${newStatus}`);
        fetchData();
      } else {
        throw new Error(res.message || "Failed to update status");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container admin-dashboard">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="glass-card" style={{ marginBottom: "2rem", padding: "1rem", display: "flex", gap: "1rem" }}>
        <button 
          className={`glass-btn ${activeTab === "products" ? "active" : ""}`} 
          onClick={() => setActiveTab("products")}
          style={{ flex: 1, backgroundColor: activeTab === "products" ? "rgba(255,255,255,0.2)" : "" }}
        >
          Manage Products
        </button>
        <button 
          className={`glass-btn ${activeTab === "orders" ? "active" : ""}`} 
          onClick={() => setActiveTab("orders")}
          style={{ flex: 1, backgroundColor: activeTab === "orders" ? "rgba(255,255,255,0.2)" : "" }}
        >
          Manage Orders
        </button>
      </div>

      {error && <div className="glass-alert error">{error}</div>}
      {message && <div className="glass-alert success">{message}</div>}

      {activeTab === "products" && (
        <div className="admin-section">
          <div className="glass-card" style={{ marginBottom: "2rem" }}>
            <h2>Add New Product</h2>
            <form onSubmit={handleCreateProduct} className="auth-form" style={{ maxWidth: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="glass-input" required value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" className="glass-input" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input type="text" className="glass-input" required value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" className="glass-input" required value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Description</label>
                <textarea className="glass-input" required value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
              </div>
              <button type="submit" className="glass-btn primary" style={{ gridColumn: "1 / -1" }} disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>

          <div className="glass-card">
            <h2>Existing Products</h2>
            {loading && !products.length ? <p>Loading...</p> : (
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                      <th style={{ padding: "1rem" }}>Image</th>
                      <th style={{ padding: "1rem" }}>Title</th>
                      <th style={{ padding: "1rem" }}>Price</th>
                      <th style={{ padding: "1rem" }}>Category</th>
                      <th style={{ padding: "1rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        <td style={{ padding: "1rem" }}>
                          <img src={p.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"} alt={p.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                        </td>
                        <td style={{ padding: "1rem" }}>{p.title}</td>
                        <td style={{ padding: "1rem" }}>₹{p.price}</td>
                        <td style={{ padding: "1rem" }}>{p.category}</td>
                        <td style={{ padding: "1rem" }}>
                          <button className="glass-btn-small" style={{ backgroundColor: "rgba(255,50,50,0.2)", color: "#ff6b6b" }} onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: "1rem", textAlign: "center" }}>No products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="admin-section glass-card">
          <h2>All Orders</h2>
          {loading && !orders.length ? <p>Loading...</p> : (
            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                    <th style={{ padding: "1rem" }}>Order ID</th>
                    <th style={{ padding: "1rem" }}>User</th>
                    <th style={{ padding: "1rem" }}>Amount</th>
                    <th style={{ padding: "1rem" }}>Status</th>
                    <th style={{ padding: "1rem" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <td style={{ padding: "1rem" }}>{o._id}</td>
                      <td style={{ padding: "1rem" }}>{o.user?.email || o.user || "N/A"}</td>
                      <td style={{ padding: "1rem" }}>₹{o.totalAmount}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ 
                          padding: "0.2rem 0.5rem", 
                          borderRadius: "4px",
                          backgroundColor: o.status === "Delivered" ? "rgba(50,255,50,0.2)" : "rgba(255,200,50,0.2)"
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <select 
                          className="glass-input" 
                          style={{ padding: "0.5rem" }}
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        >
                          <option value="Processing" style={{color:"black"}}>Processing</option>
                          <option value="Shipped" style={{color:"black"}}>Shipped</option>
                          <option value="Delivered" style={{color:"black"}}>Delivered</option>
                          <option value="Cancelled" style={{color:"black"}}>Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: "1rem", textAlign: "center" }}>No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
