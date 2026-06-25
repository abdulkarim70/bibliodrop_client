"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSpinner, FaTrash, FaCheckCircle, FaEyeSlash, FaBookOpen, FaImage } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ManageAllBooksClient() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/admin/all`);
        const data = await res.json();
        if (data.success) {
          // পেন্ডিং বইগুলো যেন সবার উপরে থাকে, তাই একটু সর্ট (sort) করে নিচ্ছি
          const sortedBooks = data.data.sort((a, b) => {
            if (a.status === "Pending Approval" && b.status !== "Pending Approval") return -1;
            if (a.status !== "Pending Approval" && b.status === "Pending Approval") return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setBooks(sortedBooks);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBooks();
  }, []);

  // স্ট্যাটাস আপডেট করার ফাংশন (Approve / Publish / Unpublish)
  const handleStatusChange = async (bookId, newStatus) => {
    setActionLoading(bookId);
    const toastId = toast.loading(`Updating status to ${newStatus}...`);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/status/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(`Book is now ${newStatus}!`, { id: toastId });
        setBooks(books.map(b => b._id === bookId ? { ...b, status: newStatus } : b));
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast.error("Error updating status", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  // বই ডিলিট করার ফাংশন
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to completely delete this book?")) return;

    setActionLoading(bookId);
    const toastId = toast.loading("Deleting book...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Book deleted successfully", { id: toastId });
        setBooks(books.filter(b => b._id !== bookId));
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting book", { id: toastId });
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
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-[#fcfcfd]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaBookOpen className="text-[#6a46cd]" /> Manage All Books
        </h2>
        <p className="text-gray-500 mt-1">Approve pending books and manage platform inventory.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f7fd] border-b border-gray-100 text-[#6a46cd] text-xs uppercase tracking-wider font-bold">
                <th className="p-5 w-1/3">Book & Uploader</th>
                <th className="p-5 w-1/6">Category</th>
                <th className="p-5 w-1/6">Fee</th>
                <th className="p-5 w-1/6">Status</th>
                <th className="p-5 w-1/6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {books.map((book) => {
                return (
                  <tr key={book._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    
                    {/* Book Info (Image + Title + Uploader) */}
                    <td className="p-5 flex items-center gap-4">
                      <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                        {book.image ? (
                          <Image 
                            src={book.image} 
                            alt={book.title} 
                            fill
                            className="object-cover" 
                            unoptimized
                          />
                        ) : (
                          <FaImage className="text-gray-300 text-xl" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-base max-w-[200px] truncate" title={book.title}>
                          {book.title}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5 max-w-[200px] truncate" title={book.librarianEmail}>
                          Uploaded by: {book.librarianEmail || "Unknown"}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-5 text-gray-600 font-medium">
                      {book.category || "General"}
                    </td>

                    {/* Fee */}
                    <td className="p-5 font-bold text-gray-700">
                      ${book.deliveryFee?.toFixed(2) || "0.00"}
                    </td>

                    {/* Status Badge */}
                    <td className="p-5">
                      {book.status === "Pending Approval" && (
                        <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold text-xs border border-blue-100">
                          Pending Approval
                        </span>
                      )}
                      {book.status === "Published" && (
                        <span className="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-full font-semibold text-xs border border-green-100">
                          Published
                        </span>
                      )}
                      {book.status === "Unpublished" && (
                        <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold text-xs border border-gray-200">
                          Unpublished
                        </span>
                      )}
                      {book.status === "Checked Out" && (
                        <span className="inline-block bg-orange-50 text-orange-500 px-3 py-1 rounded-full font-semibold text-xs border border-orange-100">
                          Checked Out
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        
                        {/* Approve Button (Only for Pending or Unpublished) */}
                        {(book.status === "Pending Approval" || book.status === "Unpublished") && (
                          <button
                            onClick={() => handleStatusChange(book._id, "Published")}
                            disabled={actionLoading === book._id}
                            title="Approve & Publish"
                            className="text-green-600 hover:text-green-800 transition p-2 disabled:opacity-50 bg-green-50 rounded-lg hover:bg-green-100"
                          >
                            {actionLoading === book._id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle size={16} />}
                          </button>
                        )}

                        {/* Unpublish Button (Only for Published books) */}
                        {book.status === "Published" && (
                          <button
                            onClick={() => handleStatusChange(book._id, "Unpublished")}
                            disabled={actionLoading === book._id}
                            title="Unpublish Book"
                            className="text-yellow-600 hover:text-yellow-800 transition p-2 disabled:opacity-50 bg-yellow-50 rounded-lg hover:bg-yellow-100"
                          >
                            {actionLoading === book._id ? <FaSpinner className="animate-spin" /> : <FaEyeSlash size={16} />}
                          </button>
                        )}

                        {/* Delete Button (Always available) */}
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          disabled={actionLoading === book._id}
                          title="Delete Book"
                          className="text-red-500 hover:text-red-700 transition p-2 disabled:opacity-50 bg-red-50 rounded-lg hover:bg-red-100"
                        >
                          {actionLoading === book._id ? <FaSpinner className="animate-spin" /> : <FaTrash size={16} />}
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}