import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser } from "../sevices/apiService";
import { AuthContext } from "../context/AuthContext";

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (isLogin) {
      // Handle Login
      const res = await loginUser({ email, password });
      if (res.success) {
        setSuccess("Login successful! Redirecting...");
        login(res.user);
        const searchParams = new URLSearchParams(location.search);
        const redirect = searchParams.get('redirect') || '/';
        setTimeout(() => {
          navigate(redirect === 'cart' ? '/cart' : redirect);
        }, 1500);
      } else {
        setError(res.message || "Failed to login. Check your credentials.");
      }
    } else {
      // Handle Register
      const res = await registerUser({ firstname, lastname, email, mobile, password });
      if (res.success) {
        setSuccess("Registration successful! Logging you in...");
        // Auto login on successful register
        const loginRes = await loginUser({ email, password });
        if(loginRes.success) {
           login(loginRes.user);
           const searchParams = new URLSearchParams(location.search);
           const redirect = searchParams.get('redirect') || '/';
           setTimeout(() => {
             navigate(redirect === 'cart' ? '/cart' : redirect);
           }, 1500);
        } else {
          setIsLogin(true); // fall back to login screen if auto login failed
        }
      } else {
        setError(res.message || "Failed to register account.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="glass-container">
      <div className="glass-panel" style={{ transition: "all 0.5s ease" }}>
        <h2 className="glass-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        
        {error && <div className="glass-alert error">{error}</div>}
        {success && <div className="glass-alert success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="glass-input-group">
                <input
                  type="text"
                  className="glass-input"
                  placeholder="First Name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div className="glass-input-group">
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Last Name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required={!isLogin}
                />
              </div>
              <div className="glass-input-group">
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div className="glass-input-group">
            <input
              type="email"
              className="glass-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="glass-input-group">
            <input
              type="password"
              className="glass-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="glass-btn" disabled={loading}>
            {loading ? "Authenticating..." : (isLogin ? "Login" : "Sign Up")}
          </button>
        </form>
        
        <div className="glass-link">
          {isLogin ? (
            <>Don't have an account? <span style={{color: '#e94560', cursor: 'pointer', fontWeight: 600}} onClick={() => setIsLogin(false)}>Create one here</span></>
          ) : (
            <>Already have an account? <span style={{color: '#e94560', cursor: 'pointer', fontWeight: 600}} onClick={() => setIsLogin(true)}>Login instead</span></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
