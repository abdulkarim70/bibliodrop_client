"use client";

import { useState, useEffect } from "react";
import { FaSpinner, FaHistory } from "react-icons/fa";

export default function DeliveryHistoryClient({ userEmail }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries/user/${userEmail}`);
        const data = await res.json();
        
        if (data.success) {
          // নতুন ডেলিভারিগুলো যেন উপরে থাকে, তাই reverse করা হলো
          setDeliveries(data.data.reverse()); 
        }
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchDeliveries();
    }
  }, [userEmail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-[#6a46cd]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-[#fcfcfd]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaHistory className="text-[#6a46cd]" /> Delivery History
        </h2>
        <p className="text-gray-500 mt-1">Track all your book delivery requests.</p>
      </div>

      {deliveries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg">You have no delivery requests yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f7fd] border-b border-gray-100 text-[#6a46cd] text-xs uppercase tracking-wider font-bold">
                  <th className="p-5">Book Title</th>
                  <th className="p-5">Delivery Fee</th>
                  <th className="p-5">Request Date</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {deliveries.map((delivery) => {
                  // তারিখ ফরম্যাট করা (যেমন: Jun 15, 2026)
                  const dateObj = new Date(delivery.date || delivery.createdAt);
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={delivery._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      {/* Book Title */}
                      <td className="p-5">
                        <div className="font-semibold text-gray-800 text-base max-w-[200px] truncate">
                          {delivery.bookTitle}
                        </div>
                      </td>

                      {/* Delivery Fee */}
                      <td className="p-5 font-bold text-gray-700">
                        ${delivery.fee?.toFixed(2) || "0.00"}
                      </td>

                      {/* Request Date */}
                      <td className="p-5 text-gray-600 font-medium">
                        {formattedDate}
                      </td>

                      {/* Status Badges (ছবির ডিজাইনের মতো) */}
                      <td className="p-5">
                        {delivery.status === "Delivered" ? (
                          <span className="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-full font-semibold text-xs border border-green-100">
                            Delivered
                          </span>
                        ) : (
                          <span className="inline-block bg-orange-50 text-orange-500 px-3 py-1 rounded-full font-semibold text-xs border border-orange-100">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Transaction ID */}
                      <td className="p-5">
                        <div className="text-gray-500 font-mono text-xs max-w-[150px] truncate">
                          {delivery.transactionId || "N/A"}
                        </div>
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