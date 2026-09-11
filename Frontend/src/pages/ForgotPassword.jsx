import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState(""); // shown on screen since we're in demo mode
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/api/auth/send-otp", { email });
      setDemoOtp(res.data.otp); // demo mode only — a real app would NOT do this
      setStep(2);
    } catch (error) {
      const errorMsg = typeof error.response?.data === 'string'
        ? error.response.data
        : "Failed to generate OTP. Try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/auth/reset-password", { email, otp, newPassword });
      alert("Password reset successfully! Please login with your new password.");
      navigate("/login");
    } catch (error) {
      const errorMsg = typeof error.response?.data === 'string'
        ? error.response.data
        : "Something went wrong. Please try again.";
      alert("Reset Failed: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-600">Money Pilot</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          {step === 1 ? "Reset your password" : "Enter the OTP and your new password"}
        </p>

        {step === 1 ? (
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

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all active:scale-95 shadow-md disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {demoOtp && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3 rounded-lg text-center">
                <strong>Demo Mode:</strong> Your OTP is <span className="font-mono font-bold">{demoOtp}</span>
                <br />
                <span className="text-xs">(In production this would be emailed, not shown here)</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                placeholder="6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all tracking-widest text-center font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleReset()}
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all active:scale-95 shadow-md disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-gray-400 font-bold text-xs py-1"
            >
              ← Use a different email
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;