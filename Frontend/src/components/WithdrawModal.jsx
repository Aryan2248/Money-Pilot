import { useState } from "react";
import API from "../services/api";

export default function WithdrawModal({ isOpen, onClose, onRefresh, maxSavings }) {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/wallet/withdraw", { amount: parseFloat(amount) });
      onRefresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-red-900/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <h2 className="text-2xl font-black text-red-600 mb-2">Emergency Use</h2>
        <p className="text-gray-500 text-sm mb-6">Moving money from savings to your spending balance.</p>
        
        <form onSubmit={handleWithdraw} className="space-y-4">
          <input
            type="number"
            className="w-full p-4 bg-red-50 border border-red-100 rounded-2xl outline-none focus:border-red-500 font-bold"
            placeholder={`Available: ₹${maxSavings}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-xl">Confirm Emergency Transfer</button>
          <button type="button" onClick={onClose} className="w-full text-gray-400 font-bold py-2">Go Back</button>
        </form>
      </div>
    </div>
  );
}