"use client";

import { useState, useEffect } from "react";
import { FaBook, FaDollarSign, FaClock, FaSpinner } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function LibrarianOverviewClient({ librarianEmail }) {
  const [stats, setStats] = useState({
    totalBooksListed: 0,
    totalEarnings: 0.00,
    pendingRequests: 0,
  });
  
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  // চার্টের জন্য কালার কোড (ছবির সাথে মিল রেখে পার্পল শেড)
  const COLORS = ['#6a46cd', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe'];

  useEffect(() => {
    const fetchLibrarianData = async () => {
      try {
        // ১. লাইব্রেরিয়ানের বইগুলো আনা
        const booksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/librarian/${librarianEmail}`);
        const booksData = await booksRes.json();

        // ২. লাইব্রেরিয়ানের ডেলিভারিগুলো আনা
        const deliveriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries/librarian/${librarianEmail}`);
        const deliveriesData = await deliveriesRes.json();

        if (booksData.success && deliveriesData.success) {
          const books = booksData.data;
          const deliveries = deliveriesData.data;

          // স্ট্যাটস ক্যালকুলেশন
          let earnings = 0;
          let pending = 0;

          deliveries.forEach((del) => {
            // সমস্ত রিকোয়েস্টের ফি যোগ করে টোটাল আর্নিং
            if(del.fee) earnings += del.fee;
            // পেন্ডিং রিকোয়েস্ট কাউন্ট
            if (del.status === "Pending Delivery") pending++;
          });

          setStats({
            totalBooksListed: books.length,
            totalEarnings: earnings,
            pendingRequests: pending,
          });

          // পাই চার্টের জন্য ক্যাটাগরি অনুযায়ী ডেটা গোছানো
          const categoryCount = {};
          books.forEach((book) => {
            const cat = book.category || "General";
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
          });

          const formattedPieData = Object.keys(categoryCount).map((key) => ({
            name: key,
            value: categoryCount[key],
          }));

          setPieData(formattedPieData);
        }
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (librarianEmail) {
      fetchLibrarianData();
    }
  }, [librarianEmail]);

  // পাই চার্টের লেবেল কাস্টমাইজ করা (e.g., Romance 50%)
  const renderCustomizedLabel = ({ name, percent }) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
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
        <h1 className="text-3xl font-bold text-gray-800">Manage your books and deliveries.</h1>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Total Books Listed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
            <FaBook />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Books Listed</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalBooksListed}</h3>
          </div>
        </div>

        {/* Card 2: Total Earnings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl">
            <FaDollarSign />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Earnings</p>
            <h3 className="text-3xl font-bold text-gray-800">${stats.totalEarnings.toFixed(2)}</h3>
          </div>
        </div>

        {/* Card 3: Pending Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl">
            <FaClock />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Pending Requests</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.pendingRequests}</h3>
          </div>
        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col md:w-2/3 lg:w-1/2">
        <h2 className="text-xl font-bold text-gray-800 mb-6 font-serif">Books by Category</h2>
        
        {pieData.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-center">
            <p className="text-gray-500 text-lg">No books listed yet to show categories.</p>
          </div>
        ) : (
          <div className="flex-grow w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}