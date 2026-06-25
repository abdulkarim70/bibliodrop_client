"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaSpinner, FaBookOpen, FaArrowRight } from "react-icons/fa";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        // size=6 দিয়ে প্রথম ৬টি Published বই আনছি
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?page=0&size=6`);
        const data = await res.json();
        
        if (data.success) {
          setBooks(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  // Framer Motion - কন্টেইনার এবং কার্ডের অ্যানিমেশন ভ্যারিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // একটির পর একটি কার্ড আসবে
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-[#6a46cd]" />
      </div>
    );
  }

  if (books.length === 0) return null; // বই না থাকলে সেকশনটি হাইড থাকবে

  return (
    <section className="py-20 bg-[#fcfcfd]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-[#6a46cd] font-bold text-sm tracking-widest uppercase mb-2 block">
              Top Picks For You
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif">
              Featured Books
            </h2>
          </div>
          <Link 
            href="/books" 
            className="group flex items-center gap-2 text-[#6a46cd] font-bold hover:text-purple-800 transition-colors"
          >
            View All Collection 
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Books Grid with Framer Motion */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // স্ক্রিনে আসার পর অ্যানিমেশন শুরু হবে
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {books.map((book) => (
            <motion.div
              key={book._id}
              variants={cardVariants}
              whileHover={{ y: -8 }} // হোভার করলে কার্ডটি কিছুটা উপরে উঠবে
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-shadow flex flex-col group"
            >
              {/* Image Section */}
              <div className="relative w-full h-72 bg-gray-50 overflow-hidden">
                {book.image ? (
                  <Image 
                    src={book.image} 
                    alt={book.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    unoptimized 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <FaBookOpen className="text-6xl" />
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[#6a46cd] text-xs font-bold uppercase px-3 py-1.5 rounded-full shadow-sm">
                    {book.category || "General"}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#6a46cd] transition-colors" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">By {book.author}</p>
                
                <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                  <span className="text-lg font-bold text-green-600">
                    ${book.deliveryFee?.toFixed(2)}
                  </span>
                  <Link 
                    href={`/books/${book._id}`}
                    className="px-5 py-2 bg-gray-50 text-gray-700 font-bold rounded-xl text-sm hover:bg-[#6a46cd] hover:text-white transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}