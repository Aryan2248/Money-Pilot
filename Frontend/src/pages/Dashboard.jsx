import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ExpenseModal from "../components/ExpenseModal";
import SetBudgetModal from "../components/SetBudgetModal";
import IncomeModal from "../components/IncomeModal";
import WithdrawModal from "../components/WithdrawModal";

// --- UPDATED PDF IMPORTS ---
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 

export default function Dashboard() {
  const [wallet, setWallet] = useState({ remainingBalance: 0, savings: 0, totalIncome: 0 });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [activeExpense, setActiveExpense] = useState(null);

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  const loadData = async () => {
    try {
      const [walletRes, expRes] = await Promise.all([
        API.get("/api/wallet/info"),
        API.get("/api/expenses/all")
      ]);
      
      setWallet(walletRes.data);
      const sortedExpenses = expRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sortedExpenses);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- UPDATED PDF EXPORT FUNCTION ---
  const downloadPDFReport = () => {
    const doc = new jsPDF();
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    // Header
    doc.setFontSize(22);
    doc.setTextColor(20, 20, 20);
    doc.text("Money Pilot Statement", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Period: ${currentMonth}`, 14, 28);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 33);

    // Summary Table using autoTable(doc, options)
    autoTable(doc, {
      startY: 40,
      head: [['Metric', 'Amount (INR)']],
      body: [
        ['Total Income Inflow', `INR ${wallet.totalIncome.toLocaleString()}`],
        ['Emergency Savings', `INR ${wallet.savings.toLocaleString()}`],
        ['Available Spending Balance', `INR ${wallet.remainingBalance.toLocaleString()}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }, // Indigo color
    });

    // Transactions Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Date', 'Title', 'Category', 'Amount']],
      body: expenses.map(exp => [
        exp.date,
        exp.title,
        exp.category,
        `INR ${exp.amount}`
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] } // Dark Gray color
    });

    doc.save(`MoneyPilot_Report_${currentMonth.replace(" ", "_")}.pdf`);
  };

  const openAddExpense = () => {
    setActiveExpense(null);
    setIsExpenseOpen(true);
  };

  const openEditExpense = (exp) => {
    setActiveExpense(exp);
    setIsExpenseOpen(true);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-gray-500 animate-pulse uppercase tracking-widest text-xs">Syncing Money Pilot...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Money Pilot</h1>
            <p className="text-gray-400 font-medium text-sm italic">Intelligent Cash-Flow Management</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsBudgetOpen(true)}
              className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition shadow-sm text-lg"
              title="Budget Limits"
            >
              ⚙️
            </button>
            <button 
              onClick={handleLogout}
              className="px-5 py-3 text-red-500 font-black text-xs uppercase bg-red-50 rounded-2xl hover:bg-red-100 transition tracking-widest"
            >
              Logout
            </button>
          </div>
        </div>

        {/* --- PRIMARY ACTION BAR --- */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => setIsIncomeOpen(true)} 
            className="group flex items-center justify-center gap-3 bg-green-600 text-white p-6 rounded-[2rem] font-black shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform">+</span> 
            Add Income
          </button>
          <button 
            onClick={openAddExpense} 
            className="group flex items-center justify-center gap-3 bg-blue-600 text-white p-6 rounded-[2rem] font-black shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform">+</span> 
            Log Expense
          </button>
        </div>

        {/* --- WALLET METRICS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="flex justify-between items-start">
              <h2 className="text-[10px] uppercase font-black opacity-40 tracking-[0.2em]">Available to Spend</h2>
              <button onClick={() => setIsIncomeOpen(true)} className="opacity-30 hover:opacity-100 transition">✏️</button>
            </div>
            <p className="text-4xl font-black">₹ {wallet.remainingBalance.toLocaleString()}</p>
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between min-h-[180px]">
            <div>
              <h2 className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2">Urgent Fund</h2>
              <p className="text-4xl font-black text-gray-800">₹ {wallet.savings.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => setIsWithdrawOpen(true)} 
              className="text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
            >
              Emergency Withdrawal <span>→</span>
            </button>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex flex-col justify-center">
             <div className="flex justify-between items-center mb-5">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Lifetime Inflow</span>
                <span className="font-black text-indigo-900">₹ {wallet.totalIncome.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center border-t border-indigo-200/50 pt-5">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Total Outflow</span>
                <span className="font-black text-red-500">₹ {(wallet.totalIncome - wallet.remainingBalance - wallet.savings).toLocaleString()}</span>
             </div>
          </div>
        </div>

        {/* --- TRANSACTION LOGS --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
              Recent Logs
              <span className="text-xs font-bold text-gray-300 px-2 py-1 bg-white border rounded-lg">{expenses.length}</span>
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {expenses.length === 0 ? (
              <div className="p-24 text-center">
                <p className="text-gray-300 font-bold italic mb-2">Your ledger is empty.</p>
                <button onClick={openAddExpense} className="text-blue-500 font-black text-xs uppercase hover:underline">Add your first expense</button>
              </div>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="p-6 flex justify-between items-center hover:bg-gray-50/80 group transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                      {exp.category === "Food" ? "🍔" : exp.category === "Transport" ? "🚗" : exp.category === "Shopping" ? "🛍️" : "📦"}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-lg leading-tight">{exp.title}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{exp.category} • {exp.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <p className="font-black text-xl text-red-500">₹ {exp.amount.toLocaleString()}</p>
                     <button onClick={() => openEditExpense(exp)} className="opacity-0 group-hover:opacity-100 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Modify</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- REPORT & HISTORY SECTION --- */}
        <div className="bg-indigo-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-100">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Monthly Archive</h2>
            <p className="text-indigo-200 text-sm opacity-80">Export your spending history as a professional PDF document.</p>
          </div>
          <button 
            onClick={downloadPDFReport}
            className="w-full md:w-auto bg-white text-indigo-900 px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-50 active:scale-95 transition-all shadow-lg"
          >
            <span className="text-xl">📥</span> Download PDF
          </button>
        </div>

        <p className="text-center text-gray-300 text-[9px] font-black uppercase tracking-[0.4em] mt-12 pb-10">
          Money Pilot v2.5 • Powered by MERN Stack
        </p>

      </div>

      {/* --- MODAL LAYER --- */}
      <IncomeModal isOpen={isIncomeOpen} onClose={() => setIsIncomeOpen(false)} onRefresh={loadData} />
      <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} onRefresh={loadData} maxSavings={wallet.savings} />
      <ExpenseModal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} onRefresh={loadData} editData={activeExpense} />
      <SetBudgetModal isOpen={isBudgetOpen} onClose={() => setIsBudgetOpen(false)} onBudgetUpdated={loadData} />
    </div>
  );
}