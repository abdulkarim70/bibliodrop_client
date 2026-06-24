"use client";

import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import PaymentModal from "./PaymentModal"; // আপনার PaymentModal এর সঠিক পাথ দেবেন

export default function UserActionButtons({ book, currentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isCheckedOut = book.status === "Checked Out";

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
        {/* Request Delivery Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isCheckedOut}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-bold text-lg shadow-md transition-all ${
            isCheckedOut
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6a46cd] hover:bg-blue-500 hover:shadow-xl"
          }`}
        >
          Request Delivery
        </button>

        {/* Wishlist Button */}
        <button className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-pink-600 font-bold text-lg bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-all">
          <FaHeart className="text-xl" />
          Add to Wishlist
        </button>
      </div>

      {/* Payment Modal Component */}
      <PaymentModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        book={book}
        userEmail={currentUser?.email}
      />
    </>
  );
}