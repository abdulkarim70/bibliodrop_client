"use client";

import { useState, useEffect } from "react";
import { FaSpinner, FaMoneyCheckAlt, FaSearch } from "react-icons/fa";

export default function AllTransactionsClient() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/transactions`);
        const data = await res.json();
        
        if (data.success) {
          // নতুন ট্রানজেকশনগুলো যেন উপরে থাকে
          setTransactions(data.data.reverse()); 
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-[#6a46cd]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-[#fcfcfd]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaMoneyCheckAlt className="text-[#6a46cd]" /> All Transactions
        </h2>
        <p className="text-gray-500 mt-1">Monitor platform-wide payments and delivery fees.</p>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg">No transactions found on the platform yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f7fd] border-b border-gray-100 text-[#6a46cd] text-xs uppercase tracking-wider font-bold">
                  <th className="p-5 w-1/4">Client Details</th>
                  <th className="p-5 w-1/4">Book Information</th>
                  <th className="p-5 w-1/6">Transaction ID</th>
                  <th className="p-5 w-1/6">Date</th>
                  <th className="p-5 w-1/6">Amount & Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.map((txn) => {
                  const dateObj = new Date(txn.createdAt || txn.date);
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={txn._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      
                      {/* Client Details */}
                      <td className="p-5">
                        <div className="font-semibold text-gray-800 text-base mb-0.5 max-w-[180px] truncate">
                          {txn.userName || "Unknown User"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {txn.userEmail}
                        </div>
                      </td>

                      {/* Book Details */}
                      <td className="p-5">
                        <div className="font-semibold text-gray-800 max-w-[180px] truncate" title={txn.bookTitle}>
                          {txn.bookTitle}
                        </div>
                      </td>

                      {/* Transaction ID */}
                      <td className="p-5">
                        <div className="text-gray-500 font-mono text-xs bg-gray-50 px-2 py-1 rounded inline-block">
                          {txn.transactionId || "N/A"}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="p-5 text-gray-600 font-medium">
                        {formattedDate}
                      </td>

                      {/* Amount & Delivery Status */}
                      <td className="p-5">
                        <div className="font-bold text-green-600 text-lg mb-1">
                          ${txn.fee?.toFixed(2) || "0.00"}
                        </div>
                        {txn.status === "Delivered" ? (
                          <span className="inline-block bg-green-50 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold border border-green-100 uppercase tracking-wide">
                            Delivered
                          </span>
                        ) : (
                          <span className="inline-block bg-orange-50 text-orange-500 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-100 uppercase tracking-wide">
                            Pending
                          </span>
                        )}
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}