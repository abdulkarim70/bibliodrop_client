"use client";

import { useState, useEffect } from "react";
import { FaSpinner, FaBookReader, FaCheckCircle, FaStar } from "react-icons/fa";
import Link from "next/link";

export default function ReadingListClient({ userEmail }) {
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadingList = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries/user/${userEmail}`);
        const data = await res.json();
        
        if (data.success) {
          // শুধুমাত্র "Delivered" স্ট্যাটাসের ডেলিভারিগুলো ফিল্টার করা
          const deliveredBooks = data.data.filter(
            (delivery) => delivery.status === "Delivered"
          );
          // নতুন ডেলিভারিগুলো যেন উপরে থাকে
          setReadingList(deliveredBooks.reverse()); 
        }
      } catch (error) {
        console.error("Error fetching reading list:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchReadingList();
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
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaBookReader className="text-[#6a46cd]" /> My Reading List
        </h2>
        <p className="text-gray-500 mt-2">Books that have been delivered to you. Enjoy reading!</p>
      </div>

      {readingList.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center justify-center">
          <FaBookReader className="text-6xl text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Your reading list is empty</h3>
          <p className="text-gray-500 mb-6">You haven't received any books yet. Start exploring and request a delivery!</p>
          <Link 
            href="/books" 
            className="px-6 py-3 bg-[#6a46cd] text-white rounded-xl font-bold shadow-md hover:bg-purple-700 transition"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readingList.map((item) => {
            const dateObj = new Date(item.date || item.createdAt);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div 
                key={item._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Decorative top bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#6a46cd]"></div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                      <FaCheckCircle /> Delivered
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{formattedDate}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2" title={item.bookTitle}>
                    {item.bookTitle}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-6">
                    Transaction ID: <span className="font-mono text-xs bg-gray-50 px-1 py-0.5 rounded text-gray-600">{item.transactionId || "N/A"}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-100 pt-4 mt-auto flex gap-3">
                  <Link 
                    href={`/books/${item.bookId}`}
                    className="flex-1 text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-200 transition"
                  >
                    View Details
                  </Link>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl text-sm font-bold border border-yellow-200 transition">
                    <FaStar /> Write Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}