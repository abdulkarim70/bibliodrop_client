"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSpinner, FaTrash, FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ManageUsersClient({ currentUserEmail }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
        const data = await res.json();
        if (data.success) {
          setUsers(data.data.reverse());
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // রোল আপডেট করার ফাংশন (অ্যালার্ট সহ)
  const handleRoleChange = async (userId, newRole) => {
    // রোল পরিবর্তন করার আগে কনফার্মেশন অ্যালার্ট
    const confirmChange = window.confirm(`Are you sure you want to change this user's role to "${newRole}"?`);
    if (!confirmChange) return;

    setActionLoading(userId);
    const toastId = toast.loading("Updating role...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/role/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(`Role updated to ${newRole}`, { id: toastId });
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast.error("Error updating role", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  // ইউজার ডিলিট করার ফাংশন
  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === currentUserEmail) {
      toast.error("You cannot delete your own admin account!");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setActionLoading(userId);
    const toastId = toast.loading("Deleting user...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        toast.success("User deleted successfully", { id: toastId });
        setUsers(users.filter(u => u._id !== userId));
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting user", { id: toastId });
    } finally {
      setActionLoading(null);
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
        <h2 className="text-2xl font-bold text-gray-800">View and manage all platform users.</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f7fd] border-b border-gray-100 text-[#6a46cd] text-xs uppercase tracking-wider font-bold">
                <th className="p-5 w-1/3">User</th>
                <th className="p-5 w-1/4">Email</th>
                <th className="p-5 w-1/6">Role</th>
                <th className="p-5 w-1/6">Joined</th>
                <th className="p-5 w-1/12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => {
                const dateObj = new Date(user.createdAt || Date.now());
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                
                // ডাটাবেস স্যাম্পল অনুযায়ী ডিফল্ট রোল "reader" ধরা হয়েছে
                const currentRole = user.role || "reader"; 

                return (
                  <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    
                    {/* User Info (Avatar + Name) */}
                    <td className="p-5 flex items-center gap-3">
                      {user.image ? (
                        <div className="relative w-10 h-10 shrink-0">
                          <Image 
                            src={user.image} 
                            alt={user.name || "User"} 
                            fill
                            className="rounded-full object-cover" 
                            unoptimized
                          />
                        </div>
                      ) : (
                        <FaUserCircle className="text-4xl text-gray-300 shrink-0" />
                      )}
                      <span className="font-semibold text-gray-800 text-base">{user.name || "Unknown User"}</span>
                    </td>

                    {/* Email */}
                    <td className="p-5 text-gray-600">
                      {user.email}
                    </td>

                    {/* Role Dropdown */}
                    <td className="p-5">
                      <select
                        value={currentRole}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={actionLoading === user._id}
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-1.5 outline-none focus:border-[#6a46cd] transition-colors cursor-pointer text-sm font-medium shadow-sm disabled:opacity-50"
                      >
                        <option value="reader">Reader</option>
                        <option value="librarian">Librarian</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Joined Date */}
                    <td className="p-5 text-gray-500 font-medium">
                      {formattedDate}
                    </td>

                    {/* Actions (Delete) */}
                    <td className="p-5 text-center">
                      <button
                        onClick={() => handleDeleteUser(user._id, user.email)}
                        disabled={actionLoading === user._id || user.email === currentUserEmail}
                        title="Delete User"
                        className="text-red-400 hover:text-red-600 transition p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {actionLoading === user._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash size={16} />
                        )}
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}