"use client";

import React, { useState } from 'react';
import Link from 'next/link';
// গ্রাভিটি আইকন
import { Moon } from '@gravity-ui/icons'; 
import Image from 'next/image';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* --- লোগো --- */}
        <Link href="/">
          <Image
            src="/Logo_F.png"
            alt="Banner"
            width={150} 
            height={225}
            className="w-[120px] md:w-[180px] h-auto" 
          />
        </Link>

       
        <div className="hidden md:flex items-center gap-2 font-medium text-[15px]">
          <Link href="/" className="px-5 py-2 bg-[#f3f0ff] text-[#6a46cd] rounded-2xl transition-all">
            Home
          </Link>
          <Link href="/browse" className="px-5 py-2 text-gray-500 rounded-2xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
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

    
        <div className="flex items-center gap-3">
         
          <button className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
            <Moon className="w-5 h-5" />
          </button>
          
         
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-6 py-2.5 border-2 border-gray-200 text-[#6a46cd] font-bold rounded-2xl hover:border-[#6a46cd] transition-all text-sm">
              Login
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-[#6a46cd] text-white font-bold rounded-2xl hover:bg-[#5839b3] shadow-md shadow-purple-100 transition-all text-sm">
              Register
            </Link>
          </div>

          
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

     
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 shadow-lg absolute w-full">
          <Link href="/" className="block px-5 py-3 bg-[#f3f0ff] text-[#6a46cd] font-medium rounded-xl transition-all">
            Home
          </Link>
          <Link href="/browse" className="block px-5 py-3 text-gray-600 font-medium rounded-xl transition-all hover:bg-[#f3f0ff] hover:text-[#6a46cd]">
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

          {/*Mobile Menu*/}
          <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-gray-100">
            <Link href="/login" className="w-full text-center px-6 py-3 border-2 border-gray-200 text-[#6a46cd] font-bold rounded-xl hover:border-[#6a46cd] transition-all text-sm">
              Login
            </Link>
            <Link href="/register" className="w-full text-center px-6 py-3 bg-[#6a46cd] text-white font-bold rounded-xl hover:bg-[#5839b3] shadow-md transition-all text-sm">
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;