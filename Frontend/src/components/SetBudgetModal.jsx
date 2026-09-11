import { useState } from "react";
import API from "../services/api";

export default function SetBudgetModal({ isOpen, onClose, onBudgetUpdated }) {
  const [formData, setFormData] = useState({
    category: "Food",
    limitAmount: "",
    month: new Date().toISOString().slice(0, 7), // Defaults to current month "2026-04"
  });
  const [status, setStatus] = useState({ type: "", msg: "" });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    try {
      // This hits your @PostMapping("/set") or similar in BudgetController
      await API.post("/api/budgets/set", formData);
      setStatus({ type: "success", msg: "Budget limit updated successfully!" });
      
      // Optional: callback to refresh dashboard data if needed
      if (onBudgetUpdated) onBudgetUpdated();
      
      // Close after a brief delay so user sees success
      setTimeout(onClose, 1500);
    } catch (err) {
      setStatus({ 
        type: "error", 
        msg: err.response?.data?.message || "Failed to update budget limit" 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Set Budget Limit</h2>
        <p className="text-gray-500 text-sm mb-6">Define your spending cap for specific categories.</p>
        
        {status.msg && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-bold border ${
            status.type === "success" 
              ? "bg-green-50 border-green-100 text-green-700" 
              : "bg-red-50 border-red-100 text-red-700"
          }`}>
            {status.type === "success" ? "✅" : "❌"} {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Category</label>
            <select 
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">New Limit (₹)</label>
              <input
                type="number"
                placeholder="2000"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.limitAmount}
                onChange={(e) => setFormData({...formData, limitAmount: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-1">Month</label>
              <input
                type="month"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.month}
                onChange={(e) => setFormData({...formData, month: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition"
            >
              Update Limit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}