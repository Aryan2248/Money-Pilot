import { useState, useEffect } from "react";
import API from "../services/api";

export default function IncomeModal({ isOpen, onClose, onRefresh }) {
  const [amount, setAmount] = useState("");
  const [savingsPercent, setSavingsPercent] = useState(10);
  const [calculated, setCalculated] = useState({ toSpending: 0, toSavings: 0 });
  const [loading, setLoading] = useState(false);

  // Real-time calculation logic
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const savings = (numAmount * savingsPercent) / 100;
    const spending = numAmount - savings;
    
    setCalculated({
      toSpending: spending,
      toSavings: savings
    });
  }, [amount, savingsPercent]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/api/wallet/add-income", { 
        amount: parseFloat(amount), 
        savingsPercent: parseFloat(savingsPercent) 
      });
      await onRefresh();
      onClose();
      setAmount("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Deposit Funds</h2>
        <p className="text-gray-400 text-sm font-medium mb-8">How much are we moving today?</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Amount Input */}
          <div className="relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Income Amount (₹)</label>
            <input
              type="number"
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-3xl outline-none text-2xl font-black transition-all"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Dynamic Percentage Slider */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Urgency Allocation</label>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-black">{savingsPercent}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              value={savingsPercent}
              onChange={(e) => setSavingsPercent(e.target.value)}
            />

            {/* LIVE AMOUNT VISUALIZER */}
            <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="text-center p-3 bg-white rounded-2xl shadow-sm">
                  <p className="text-[8px] font-black text-gray-400 uppercase">To Wallet</p>
                  <p className="text-lg font-black text-blue-600">₹{calculated.toSpending.toLocaleString()}</p>
               </div>
               <div className="text-center p-3 bg-white rounded-2xl shadow-sm">
                  <p className="text-[8px] font-black text-gray-400 uppercase">To Savings</p>
                  <p className="text-lg font-black text-green-600">₹{calculated.toSavings.toLocaleString()}</p>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              type="submit" 
              disabled={loading || !amount}
              className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? "Processing Transfer..." : "Confirm Deposit"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full py-2 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}