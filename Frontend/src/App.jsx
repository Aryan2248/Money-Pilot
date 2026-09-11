import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Fixed path from components to pages
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<Login />} />
      
      {/* Register Route */}
      <Route path="/register" element={<Register />} />
      
      {/* Dashboard Route */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;