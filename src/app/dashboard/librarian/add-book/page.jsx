"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.target;
    const title = form.title.value;
    const author = form.author.value;
    const description = form.description.value;
    const deliveryFee = form.deliveryFee.value;
    const category = form.category.value;
    const imageFile = form.image.files[0];

    try {
      // ১. ImgBB তে ছবি আপলোড করা
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const imgbbData = await imgbbResponse.json();

      if (!imgbbData.success) {
        throw new Error("Image upload failed!");
      }

      const imageUrl = imgbbData.data.display_url;

     
      const bookData = {
        title,
        author,
        description,
        deliveryFee: Number(deliveryFee),
        category,
        imageUrl,
       
      };

      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Book added successfully! Waiting for Admin approval.");
        form.reset(); 
      } else {
        setMessage(result.error || "Failed to add book.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-[#6a46cd] mb-6">Add a New Book</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg text-sm ${message.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
            <input type="text" name="title" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6a46cd]" placeholder="e.g. The Great Gatsby" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input type="text" name="author" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6a46cd]" placeholder="e.g. F. Scott Fitzgerald" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6a46cd] bg-white">
            <option value="">Select a category</option>
            <option value="Fiction">Fiction</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Academic">Academic</option>
            <option value="Self-Help">Self-Help</option>
            <option value="History">History</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee ($)</label>
          <input type="number" name="deliveryFee" min="0" step="0.01" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6a46cd]" placeholder="e.g. 5.00" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="4" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6a46cd]" placeholder="Short summary of the book..."></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover Image</label>
          <input type="file" name="image" accept="image/*" required className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-[#6a46cd] hover:file:bg-purple-100 cursor-pointer" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 px-4 bg-[#6a46cd] text-white font-bold rounded-xl hover:bg-[#5839b3] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? <Spinner size="sm" color="white" /> : "Add Book"}
        </button>
      </form>
    </div>
  );
}