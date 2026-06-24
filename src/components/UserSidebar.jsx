"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const UserSidebar = () => {
  const pathname = usePathname();

  // সাইডবারের লিংক এবং আইকনগুলো
 const menuItems = [
  {
    name: "Overview",
    path: "/dashboard/user/overview",
  },
  {
    name: "Delivery History",
    path: "/dashboard/user/delivery-history",
  },
  {
    name: "My Reading List",
    path: "/dashboard/user/reading-list",
  },
  {
    name: "My Reviews",
    path: "/dashboard/user/reviews",
  },
];

  return (
    <aside className="w-full md:w-64 bg-white md:border-r border-gray-100 min-h-max md:min-h-[calc(100vh-80px)] p-4 flex-shrink-0">
      
      <div className="mb-6 px-4 hidden md:block">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          User Dashboard
        </h2>
      </div>

      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          // ইউজার যে পেজে আছেন, সেই লিংকটি অ্যাকটিভ হবে
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] ${
                isActive 
                  ? 'bg-[#f3f0ff] text-[#6a46cd] shadow-sm' // অ্যাকটিভ লিংকের স্টাইল
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#6a46cd]' // সাধারণ লিংকের স্টাইল
              }`}
            >
              <div className={`${isActive ? 'text-[#6a46cd]' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default UserSidebar;