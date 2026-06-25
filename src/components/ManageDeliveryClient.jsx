"use client";

import { useState, useEffect } from "react";
import { FaSpinner, FaCheck, FaTruck } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ManageDeliveryClient({ librarianEmail }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries/librarian/${librarianEmail}`);
        const data = await res.json();
        
        if (data.success) {
          setDeliveries(data.data.reverse()); 
        }
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    if (librarianEmail) {
      fetchDeliveries();
    }
  }, [librarianEmail]);

  // স্ট্যাটাস আপডেট করার ফাংশন
  const handleMarkDispatched = async (id) => {
    setActionLoading(id);
    const toastId = toast.loading("Updating status...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // আমরা স্ট্যাটাস "Delivered" করে দিচ্ছি যাতে ইউজারের ড্যাশবোর্ডে এটি আপডেট হয়
        body: JSON.stringify({ status: "Delivered" }), 
      });
      
      const result = await res.json();
      
      if (result.success) {
        toast.success("Marked as Dispatched / Delivered!", { id: toastId });
        
        // UI তে রিয়েল-টাইম আপডেট করা
        setDeliveries((prev) => 
          prev.map((item) => 
            item._id === id ? { ...item, status: "Delivered" } : item
          )
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update status", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

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
          <FaTruck className="text-[#6a46cd]" /> Manage Deliveries
        </h2>
        <p className="text-gray-500 mt-1">Update delivery status for your book requests.</p>
      </div>

      {deliveries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg">No delivery requests found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f7fd] border-b border-gray-100 text-[#6a46cd] text-xs uppercase tracking-wider font-bold">
                  <th className="p-5 w-1/4">Client</th>
                  <th className="p-5 w-1/4">Book</th>
                  <th className="p-5 w-1/6">Date</th>
                  <th className="p-5 w-1/6">Status</th>
                  <th className="p-5 w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {deliveries.map((delivery) => {
                  const dateObj = new Date(delivery.date || delivery.createdAt);
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={delivery._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      
                      {/* Client (Name & Email) */}
                      <td className="p-5">
                        <div className="font-semibold text-gray-800 text-base mb-0.5">
                          {delivery.userName || "Bibliophile"} {/* যদি নাম না থাকে, তবে ডিফল্ট নাম দেখাবে */}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {delivery.userEmail}
                        </div>
                      </td>

                      {/* Book Title */}
                      <td className="p-5">
                        <div className="font-semibold text-gray-800 max-w-[150px] truncate" title={delivery.bookTitle}>
                          {delivery.bookTitle}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-5 text-gray-600 font-medium">
                        {formattedDate}
                      </td>

                      {/* Status Badge */}
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

                      {/* Actions */}
                      <td className="p-5">
                        {delivery.status === "Delivered" ? (
                          <span className="text-green-500 font-semibold flex items-center gap-2 text-sm">
                            <FaCheck /> Complete
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkDispatched(delivery._id)}
                            disabled={actionLoading === delivery._id}
                            className={`px-4 py-2 rounded-xl text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center min-w-[140px] ${
                              actionLoading === delivery._id
                                ? "bg-purple-400 cursor-not-allowed"
                                : "bg-[#6a46cd] hover:bg-purple-700"
                            }`}
                          >
                            {actionLoading === delivery._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              "Mark Dispatched"
                            )}
                          </button>
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