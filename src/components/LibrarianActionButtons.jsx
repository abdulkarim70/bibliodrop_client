"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaEyeSlash, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

export default function LibrarianActionButtons({ bookId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Unpublish হ্যান্ডলার
  const handleUnpublish = async () => {
    setLoading(true);
    const toastId = toast.loading("Unpublishing book...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/status/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Unpublished" }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Book unpublished successfully!", { id: toastId });
        router.refresh(); // পেজ রিফ্রেশ করে নতুন স্ট্যাটাস দেখানোর জন্য
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Failed to unpublish book.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Delete হ্যান্ডলার
  const handleDelete = async () => {
    // ডিলিট করার আগে ইউজারের কনফার্মেশন নেওয়া
    if (!confirm("Are you sure you want to delete this book? This action cannot be undone.")) return;
    
    setLoading(true);
    const toastId = toast.loading("Deleting book...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Book deleted successfully!", { id: toastId });
        router.push("/books"); // ডিলিট হলে Browse Books পেজে পাঠিয়ে দেবে
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Failed to delete book.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Edit হ্যান্ডলার
  const handleEdit = () => {
    // পরবর্তীতে Edit পেজ তৈরি করলে এই রাউটটি কাজে লাগবে
    router.push(`/dashboard/librarian/edit-book/${bookId}`);
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-4 mt-auto">
      <button 
        onClick={handleEdit} 
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all"
      >
        <FaEdit /> Edit
      </button>
      
      <button 
        onClick={handleUnpublish} 
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-yellow-700 font-bold bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 transition-all"
      >
        {loading ? <FaSpinner className="animate-spin" /> : <><FaEyeSlash /> Unpublish</>}
      </button>
      
      <button 
        onClick={handleDelete} 
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-red-700 font-bold bg-red-50 hover:bg-red-100 border border-red-200 transition-all"
      >
        <FaTrash /> Delete
      </button>
    </div>
  );
}