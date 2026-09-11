import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function HistoryPanel({ expenses, wallet }) {
  const [showHistory, setShowHistory] = useState(false);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // PDF Header
    doc.setFontSize(22);
    doc.text("Money Pilot - Financial Statement", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    // Summary Section
    doc.autoTable({
      startY: 35,
      head: [['Metric', 'Amount (INR)']],
      body: [
        ['Total Income', `INR ${wallet.totalIncome}`],
        ['Total Savings', `INR ${wallet.savings}`],
        ['Remaining Balance', `INR ${wallet.remainingBalance}`]
      ],
      theme: 'grid'
    });

    // Transactions Table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Date', 'Title', 'Category', 'Amount']],
      body: expenses.map(exp => [
        exp.date,
        exp.title,
        exp.category,
        `INR ${exp.amount}`
      ]),
    });

    doc.save(`Money_Pilot_Statement_${new Date().getMonth() + 1}.pdf`);
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-800">Archive & Reports</h3>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs font-black uppercase tracking-widest text-blue-600 hover:underline"
          >
            {showHistory ? "Hide History" : "View History"}
          </button>
          <button 
            onClick={downloadPDF}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition"
          >
            Download PDF Report
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
           {/* You can put a simplified chart or a filtered list here */}
           <p className="text-gray-400 text-sm italic">Historical records from previous months are stored here.</p>
        </div>
      )}
    </div>
  );
}