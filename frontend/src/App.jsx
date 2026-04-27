import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/login";
import Products from "./pages/product";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Admin from "./pages/admin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
