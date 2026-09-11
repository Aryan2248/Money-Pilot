import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Basic validation to prevent empty requests
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", { email, password });
      
      // Since your AuthController returns a raw string (the token), 
      // Axios puts it in res.data. If you change the backend to return an object,
      // res.data.token will catch it.
      const token = res.data.token || res.data; 

      if (typeof token !== 'string') {
        console.error("The token is not a string! Received:", res.data);
        alert("Login failed: Unexpected server response.");
        return;
      }

      // 1. Clear any old session data
      localStorage.removeItem("token");
      
      // 2. Save the fresh token and trim it to avoid 'Whitespace' errors in Spring Boot
      localStorage.setItem("token", token.trim()); 

      // 3. Navigate instantly to the dashboard
      // No alert here makes the user experience much smoother
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      // If backend returns "Invalid password" or "User not found"
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : "Please check your credentials and try again.";
      
      alert("Login Failed: " + errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-600">Money Pilot</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Welcome back! Please login.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-blue-600 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()} // Login on Enter key
            />
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all active:scale-95 shadow-md"
          >
            Login
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;