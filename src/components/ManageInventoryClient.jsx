"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaEyeSlash, FaEye, FaSpinner, FaBookOpen } from "react-icons/fa";

// এখানে librarianEmail প্রপস হিসেবে রিসিভ করা হচ্ছে
export default function ManageInventoryClient({ librarianEmail }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    // বই ফেচ করার ফাংশনটি useEffect এর ভেতরে রাখা ভালো
    const fetchInventory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/librarian/${librarianEmail}`);
        const data = await res.json();
        if (data.success) {
          setBooks(data.data);
        }
      } catch (error) {
        toast.error("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    if (librarianEmail) {
      fetchInventory();
    }
  }, [librarianEmail]); // ডিপেন্ডেন্সি হিসেবে ইমেইল যুক্ত করা হলো

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Published" ? "Unpublished" : "Published";
    setActionLoading(id);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const result = await res.json();
      if (result.success) {
        toast.success(`Book ${newStatus.toLowerCase()} successfully!`);
        setBooks(books.map(book => book._id === id ? { ...book, status: newStatus } : book));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    setActionLoading(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
        method: "DELETE",
      });
      
      const result = await res.json();
      if (result.success) {
        toast.success("Book deleted successfully!");
        setBooks(books.filter(book => book._id !== id));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete book");
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBookOpen className="text-[#6a46cd]" /> Manage Inventory
          </h2>
          <p className="text-gray-500 mt-1">Control your book listings and visibility.</p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg">Your inventory is empty. Start by adding some books!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f7fd] border-b border-gray-100 text-[#6a46cd] text-xs uppercase tracking-wider font-bold">
                  <th className="p-5 w-2/5">Title</th>
                  <th className="p-5 w-1/5">Category</th>
                  <th className="p-5 w-1/5">Fee</th>
                  <th className="p-5 w-1/5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {books.map((book) => (
                  <tr key={book._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-5">
                      <div className="font-semibold text-gray-800 text-base mb-1 truncate max-w-[250px]">
                        {book.title}
                      </div>
                      <div className="text-gray-500 text-xs">By {book.author}</div>
                    </td>
                    <td className="p-5 text-gray-600 font-medium">
                      {book.category || "General"}
                    </td>
                    <td className="p-5 font-bold text-gray-700">
                      ${book.deliveryFee?.toFixed(2) || "0.00"}
                    </td>
                    <td className="p-5">
                      {book.status === "Pending Approval" && (
                        <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-md font-medium text-xs text-center w-24">
                          Pending<br/>Approval
                        </span>
                      )}
                      {book.status === "Published" && (
                        <span className="inline-block bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full font-semibold text-xs">
                          Published
                        </span>
                      )}
                      {book.status === "Unpublished" && (
                        <span className="inline-block bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full font-semibold text-xs">
                          Unpublished
                        </span>
                      )}
                      {book.status === "Checked Out" && (
                        <span className="inline-block bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full font-semibold text-xs">
                          Checked Out
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-4">
                        {book.status === "Published" && (
                          <button
                            onClick={() => handleToggleStatus(book._id, book.status)}
                            disabled={actionLoading === book._id}
                            title="Unpublish Book"
                            className="text-[#6a46cd] hover:text-purple-800 transition p-1 disabled:opacity-50"
                          >
                            {actionLoading === book._id ? <FaSpinner className="animate-spin" /> : <FaEyeSlash size={18} />}
                          </button>
                        )}
                        {book.status === "Unpublished" && (
                          <button
                            onClick={() => handleToggleStatus(book._id, book.status)}
                            disabled={actionLoading === book._id}
                            title="Publish Book"
                            className="text-green-600 hover:text-green-800 transition p-1 disabled:opacity-50"
                          >
                            {actionLoading === book._id ? <FaSpinner className="animate-spin" /> : <FaEye size={18} />}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(book._id)}
                          disabled={actionLoading === book._id}
                          title="Delete Book"
                          className="text-red-500 hover:text-red-700 transition p-1 disabled:opacity-50"
                        >
                           {actionLoading === book._id ? <FaSpinner className="animate-spin text-red-500" /> : <FaTrash size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}