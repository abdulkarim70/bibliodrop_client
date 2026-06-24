"use client";

import { useState, useEffect } from "react";
import { FaBook, FaTruck, FaDollarSign, FaSpinner } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function UserDashboardClient({ userEmail }) {
  const [stats, setStats] = useState({
    booksRead: 0,
    pendingDeliveries: 0,
    totalSpent: 0.00,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries/user/${userEmail}`);
        const result = await res.json();
        console.log("Fetched user stats:", result);

        if (result.success) {
          const deliveries = result.data;
          
          let pendingCount = 0;
          let readCount = 0;
          let totalFee = 0;
          const monthlyData = {};

          deliveries.forEach((delivery) => {
            // ১. কার্ডের হিসাব
            totalFee += delivery.fee || 0;
            if (delivery.status === "Pending Delivery") pendingCount++;
            if (delivery.status === "Delivered") readCount++;

            // ২. চার্টের জন্য মাস অনুযায়ী ডাটা গোছানো
            if (delivery.createdAt) {
              const date = new Date(delivery.createdAt);
              const monthName = date.toLocaleString("default", { month: "short" }); // e.g., "Jan", "Feb"
              monthlyData[monthName] = (monthlyData[monthName] || 0) + 1;
            }
          });

          setStats({
            booksRead: readCount,
            pendingDeliveries: pendingCount,
            totalSpent: totalFee,
          });

          // চার্টের অবজেক্টকে অ্যারেতে কনভার্ট করা
          const formattedChartData = Object.keys(monthlyData).map(month => ({
            name: month,
            books: monthlyData[month]
          }));

          setChartData(formattedChartData);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfcfd]">
        <FaSpinner className="animate-spin text-4xl text-[#6a46cd]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-[#fcfcfd]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Here is your reading overview.</h1>
        <p className="text-gray-500 mt-2">Track your reading habits and delivery status.</p>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
            <FaBook />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Books Read</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.booksRead}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl">
            <FaTruck />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Pending Deliveries</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.pendingDeliveries}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl">
            <FaDollarSign />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Spent</p>
            <h3 className="text-3xl font-bold text-gray-800">${stats.totalSpent.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-6 font-serif">Monthly Reading Activity</h2>
        
        {chartData.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-center">
            <p className="text-gray-500 text-lg">
              No reading activity yet. Start requesting book deliveries!
            </p>
          </div>
        ) : (
          <div className="flex-grow w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="books" fill="#6a46cd" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}