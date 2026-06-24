"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Moon } from '@gravity-ui/icons'; 
import { Avatar, Spinner } from "@heroui/react"; 
import { useRouter } from 'next/navigation';

import { authClient } from "@/lib/auth-client"; 

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const dropdownRef = useRef(null); 

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };


  const getDashboardLink = () => {
    const role = session?.user?.role;
    if (role === "admin") return "/dashboard/admin";
    if (role === "librarian") return "/dashboard/librarian";
    return "/dashboard/user"; 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/">
          <Image
            src="/Logo_F.png"
            alt="Banner"
            width={150} 
            height={225}
            className="w-[120px] md:w-[180px] h-auto" 
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2 font-medium text-[15px]">
          <Link href="/" className="px-5 py-2 bg-[#f3f0ff] text-[#6a46cd] rounded-2xl transition-all">
            Home
          </Link>
          <Link href="/books" className="px-5 py-2 text-gray-500 rounded-2xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
            Browse Books
          </Link>
          <Link href="/how-it-works" className="px-5 py-2 text-gray-500 rounded-2xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
            How It Works
          </Link>
          <Link href="/about" className="px-5 py-2 text-gray-500 rounded-2xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
            About
          </Link>
          <Link href="/contact" className="px-5 py-2 text-gray-500 rounded-2xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
            Contact
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          
          {/* Dark Mode Toggle */}
          <button className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
            <Moon className="w-5 h-5" />
          </button>
          
          {/* Desktop Auth / User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {isPending ? (
              <Spinner size="sm" color="secondary" />
            ) : session ? (
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <Avatar
                    isBordered
                    className="transition-transform cursor-pointer"
                    color="secondary"
                    name={session.user?.name || "User"}
                    size="sm"
                    src={session.user?.image || ""}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 cursor-default">
                      <p className="font-semibold text-gray-500 text-xs">Signed in as</p>
                      <p className="font-bold text-[#6a46cd] truncate">{session.user?.name || session.user?.email}</p>
                      {session.user?.role && (
                        <p className="text-[10px] uppercase bg-purple-100 text-purple-700 w-max px-2 py-0.5 rounded-full mt-1">
                          {session.user.role}
                        </p>
                      )}
                    </div>
                    
                    <div className="p-2">
                      <Link 
                        href={getDashboardLink()} 
                        onClick={() => setIsProfileOpen(false)} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Dashboard
                      </Link>

                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

            ) : (
              <>
                <Link href="/auth/login" className="px-6 py-2.5 border-2 border-gray-200 text-[#6a46cd] font-bold rounded-2xl hover:border-[#6a46cd] transition-all text-sm">
                  Login
                </Link>
                <Link href="/auth/register" className="px-6 py-2.5 bg-[#6a46cd] text-white font-bold rounded-2xl hover:bg-[#5839b3] shadow-md shadow-purple-100 transition-all text-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 shadow-lg absolute w-full">
          <Link href="/" className="block px-5 py-3 bg-[#f3f0ff] text-[#6a46cd] font-medium rounded-xl transition-all">
            Home
          </Link>
          <Link href="/books" className="block px-5 py-3 text-gray-600 font-medium rounded-xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
            Browse Books
          </Link>
          <Link href="/how-it-works" className="block px-5 py-3 text-gray-600 font-medium rounded-xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
            How It Works
          </Link>
          <Link href="/about" className="block px-5 py-3 text-gray-600 font-medium rounded-xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
            About
          </Link>
          <Link href="/contact" className="block px-5 py-3 text-gray-600 font-medium rounded-xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
            Contact
          </Link>

          {/* Mobile Auth Menu */}
          <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-gray-100">
            {isPending ? (
              <div className="flex justify-center p-4"><Spinner size="sm" color="secondary" /></div>
            ) : session ? (
              <>
                <div className="px-5 py-3 flex items-center gap-3">
                  <Avatar src={session.user?.image || ""} size="sm" isBordered color="secondary" name={session.user?.name || "User"} />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{session.user?.name || "User"}</p>
                      {session.user?.role && (
                        <span className="text-[9px] uppercase bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md">
                          {session.user.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                </div>
                
                <Link 
                  href={getDashboardLink()} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-5 py-3 text-gray-600 font-medium rounded-xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]"
                >
                  Dashboard
                </Link>

                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-5 py-3 text-red-500 font-medium rounded-xl transition-all hover:bg-red-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="w-full text-center px-6 py-3 border-2 border-gray-200 text-[#6a46cd] font-bold rounded-xl hover:border-[#6a46cd] transition-all text-sm">
                  Login
                </Link>
                <Link href="/auth/register" className="w-full text-center px-6 py-3 bg-[#6a46cd] text-white font-bold rounded-xl hover:bg-[#5839b3] shadow-md transition-all text-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;