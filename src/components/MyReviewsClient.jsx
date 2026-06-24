"use client";

import { useState, useEffect } from "react";
import { FaStar, FaSpinner, FaCommentAlt, FaCalendarAlt } from "react-icons/fa";

export default function MyReviewsClient({ userEmail }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/user/${userEmail}`);
        const data = await res.json();
        if (data.success) {
          setReviews(data.data.reverse()); // নতুন রিভিউগুলো উপরে দেখানোর জন্য
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchMyReviews();
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
          <FaCommentAlt className="text-[#6a46cd]" /> My Reviews
        </h2>
        <p className="text-gray-500 mt-2">Manage and view all the reviews you have submitted for books.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center justify-center">
          <FaCommentAlt className="text-6xl text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No reviews found</h3>
          <p className="text-gray-500">You haven't written any reviews yet. Review options will appear in your Reading List after books are delivered!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => {
            const dateObj = new Date(review.createdAt);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div 
                key={review._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Decorative Side Bar */}
                <div className="absolute top-0 left-0 h-full w-1.5 bg-[#6a46cd]"></div>

                <div className="pl-2">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1" title={review.bookTitle}>
                      {review.bookTitle || "Book Title"}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-medium whitespace-nowrap">
                      <FaCalendarAlt /> {formattedDate}
                    </span>
                  </div>

                  {/* Star Rating Display */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, index) => (
                      <FaStar 
                        key={index} 
                        className={index < review.rating ? "text-yellow-400" : "text-gray-200"} 
                        size={16}
                      />
                    ))}
                    <span className="text-xs font-bold text-gray-500 ml-1">({review.rating}/5)</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 bg-gray-50/70 p-4 rounded-xl border border-gray-50 leading-relaxed italic text-sm">
                    "{review.reviewText}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}