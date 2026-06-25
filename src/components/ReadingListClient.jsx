"use client";

import { useState, useEffect } from "react";
import { FaSpinner, FaBookReader, FaCheckCircle, FaStar, FaTimes } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ReadingListClient({ userEmail }) {
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // রিভিউ মডালের জন্য স্টেট
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // রিভিউ ফর্মের স্টেট
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchReadingList = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries/user/${userEmail}`);
        const data = await res.json();
        
        if (data.success) {
          const deliveredBooks = data.data.filter(
            (delivery) => delivery.status === "Delivered"
          );
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

  // রিভিউ মডাল ওপেন করার ফাংশন
  const openReviewModal = (book) => {
    setSelectedBook(book);
    setRating(5); // ডিফল্ট রেটিং
    setReviewText("");
    setIsReviewModalOpen(true);
  };

  // রিভিউ সাবমিট করার ফাংশন
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Please write a review text");
      return;
    }

    setSubmittingReview(true);
    const toastId = toast.loading("Submitting your review...");

    try {
      const reviewData = {
        bookId: selectedBook.bookId,
        bookTitle: selectedBook.bookTitle,
        userEmail: userEmail,
        rating: rating,
        reviewText: reviewText,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Review submitted successfully!", { id: toastId });
        setIsReviewModalOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to submit review", { id: toastId });
    } finally {
      setSubmittingReview(false);
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

                <div className="border-t border-gray-100 pt-4 mt-auto flex gap-3">
                  <Link 
                    href={`/books/${item.bookId}`}
                    className="flex-1 text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-200 transition"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => openReviewModal(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl text-sm font-bold border border-yellow-200 transition"
                  >
                    <FaStar /> Write Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsReviewModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2"
            >
              <FaTimes size={20} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Write a Review</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Share your thoughts on <span className="font-semibold text-gray-700">"{selectedBook.bookTitle}"</span>
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              
              {/* Star Rating Selection */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-colors ${
                        star <= rating ? "text-yellow-400" : "text-gray-200 hover:text-yellow-200"
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
                <textarea
                  required
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like or dislike about this book?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingReview}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-lg transition-all flex justify-center items-center gap-2 ${
                  submittingReview ? "bg-purple-400 cursor-not-allowed" : "bg-[#6a46cd] hover:bg-purple-700 shadow-md"
                }`}
              >
                {submittingReview ? (
                  <>
                    <FaSpinner className="animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}