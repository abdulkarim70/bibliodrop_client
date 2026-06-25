"use client";

import { useState, useEffect } from "react";
import { FaUsers, FaBook, FaTruck, FaDollarSign, FaSpinner } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminOverviewClient() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalDeliveries: 0,
    totalRevenue: 0.00,
  });
  
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  // চার্টের জন্য আকর্ষণীয় কিছু কালার কোড
  const COLORS = ['#6a46cd', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`);
        const result = await res.json();

        if (result.success) {
          setStats({
            totalUsers: result.data.totalUsers,
            totalBooks: result.data.totalBooks,
            totalDeliveries: result.data.totalDeliveries,
            totalRevenue: result.data.totalRevenue,
          });
          setPieData(result.data.chartData);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-800">Platform-wide overview and analytics.</h1>
      </div>

      {/* Top Cards Section - 2x2 Grid as per design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Card 1: Total Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl">
            <FaUsers />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
          </div>
        </div>

        {/* Card 2: Total Books */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
            <FaBook />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Books</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalBooks}</h3>
          </div>
        </div>

        {/* Card 3: Total Deliveries */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl">
            <FaTruck />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Deliveries</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalDeliveries}</h3>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl">
            <FaDollarSign />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-800">${stats.totalRevenue.toFixed(2)}</h3>
          </div>
        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-6 font-serif">Books by Category</h2>
        
        {pieData.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-center">
            <p className="text-gray-500 text-lg">No books listed yet to show analytics.</p>
          </div>
        ) : (
          <div className="flex-grow w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={renderCustomizedLabel}
                  outerRadius={130}
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