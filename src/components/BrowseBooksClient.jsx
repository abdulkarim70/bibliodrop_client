"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch, FaFilter, FaSpinner, FaBook, FaTimes } from "react-icons/fa";

export default function BrowseBooksClient() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টার এবং সার্চের স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");

  // ডাটা ফেচ করার ফাংশন
  const fetchBooks = async () => {
    setLoading(true);
    try {
      // API-এর লিংকে সব ফিল্টার প্যারামিটার যুক্ত করা হচ্ছে
      const queryParams = new URLSearchParams({
        search: searchQuery,
        category: category,
        availability: availability,
        ...(minFee && { minFee }),
        ...(maxFee && { maxFee })
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?${queryParams.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setBooks(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  // প্রথমবার লোড হলে এবং ফিল্টার চেঞ্জ হলে ডাটা আনবে
  useEffect(() => {
    // সার্চ টাইপ করার সময় যেন প্রতি ক্লিকে API কল না হয়, তাই সামান্য Delay (Debounce) রাখা হলো
    const delayDebounceFn = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, category, availability, minFee, maxFee]);

  // ফিল্টার রিসেট করার ফাংশন
  const resetFilters = () => {
    setSearchQuery("");
    setCategory("All");
    setAvailability("All");
    setMinFee("");
    setMaxFee("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-[#fcfcfd]">
      
      {/* Header Section */}
      <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-3">
            <FaBook className="text-[#6a46cd]" /> Browse Our Collection
          </h1>
          <p className="text-gray-500 mt-2">Discover and request your favorite books for delivery.</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4 items-end">
        
        {/* Search by Name */}
        <div className="w-full lg:w-1/3">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Title</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by name..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a46cd] focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-1/6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a46cd] transition cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Romance">Romance</option>
            <option value="History">History</option>
            <option value="Science">Science</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div className="w-full lg:w-1/6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a46cd] transition cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Checked Out">Checked Out</option>
          </select>
        </div>

        {/* Fee Range Filter */}
        <div className="w-full lg:w-1/4 flex gap-2">
          <div className="w-1/2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Min Fee ($)</label>
            <input
              type="number"
              value={minFee}
              onChange={(e) => setMinFee(e.target.value)}
              placeholder="Min"
              min="0"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a46cd] transition"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max Fee ($)</label>
            <input
              type="number"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              placeholder="Max"
              min="0"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6a46cd] transition"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="w-full lg:w-auto flex-shrink-0">
          <button
            onClick={resetFilters}
            className="w-full lg:w-auto px-6 py-3 bg-red-50 text-red-500 hover:bg-red-100 font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <FaTimes /> Clear
          </button>
        </div>
      </div>

      {/* Books Grid Section */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <FaSpinner className="animate-spin text-5xl text-[#6a46cd]" />
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
          <FaFilter className="text-6xl text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No books found</h3>
          <p className="text-gray-500">We couldn't find any books matching your current filters.</p>
          <button onClick={resetFilters} className="mt-6 text-[#6a46cd] font-bold hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              
              {/* Book Image */}
              <div className="relative w-full h-56 bg-gray-100">
                {book.image ? (
                  <Image src={book.image} alt={book.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <FaBook className="text-5xl" />
                  </div>
                )}
                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  {book.status === "Published" ? (
                    <span className="bg-green-500 text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">Available</span>
                  ) : (
                    <span className="bg-orange-500 text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">Checked Out</span>
                  )}
                </div>
              </div>

              {/* Book Details */}
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-bold text-[#6a46cd] uppercase tracking-wider mb-1">
                  {book.category || "General"}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-1">by {book.author}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="font-bold text-gray-800">
                    Fee: <span className="text-green-600">${book.deliveryFee?.toFixed(2)}</span>
                  </div>
                  <Link 
                    href={`/books/${book._id}`}
                    className="px-4 py-2 bg-[#f8f7fd] text-[#6a46cd] font-bold rounded-xl text-sm hover:bg-[#6a46cd] hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}