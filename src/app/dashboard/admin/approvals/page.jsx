"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

export default function ApprovalQueue() {
  const [pendingBooks, setPendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pending বইগুলো ফেচ করা
  const fetchPendingBooks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/admin/pending`);
      const data = await res.json();
      if (data.success) {
        setPendingBooks(data.data);
      }
    } catch (error) {
      toast.error("Failed to load pending books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  // স্ট্যাটাস আপডেট হ্যান্ডলার
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Published" }),
      });
      
      const result = await res.json();
      if (result.success) {
        toast.success("Book Approved and Published!");
        // লিস্ট থেকে অ্যাপ্রুভ হওয়া বইটি সরিয়ে দেওয়া
        setPendingBooks(pendingBooks.filter(book => book._id !== id));
      }
    } catch (error) {
      toast.error("Failed to approve book");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading pending books...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Book Approval Queue</h2>

      {pendingBooks.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100 text-center">
          No books pending for approval.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Cover</th>
                <th className="p-4 font-semibold text-gray-600">Title & Author</th>
                <th className="p-4 font-semibold text-gray-600">Librarian</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingBooks.map((book) => (
                <tr key={book._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4">
                    <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{book.librarianEmail}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(book._id)}
                        className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition font-medium text-sm"
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition font-medium text-sm">
                        <FaTrash /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}