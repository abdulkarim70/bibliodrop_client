"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaBook, FaSpinner } from "react-icons/fa";

export default function AddBookPage() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // ফর্মের ডেটা স্টোর করার স্টেট
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    deliveryFee: "",
    description: "",
  });

  // ইনপুট পরিবর্তনের হ্যান্ডলার
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ইমেজ সিলেক্ট করার হ্যান্ডলার
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Next Image-এ প্রিভিউ দেখানোর জন্য লোকাল URL তৈরি করা
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error("Please select a book cover image!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading image & adding book...");

    try {
      // ১. imgBB তে ইমেজ আপলোড করা
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);

      const imgbbRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imageFormData,
        }
      );
      const imgbbData = await imgbbRes.json();

      if (!imgbbData.success) {
        throw new Error("Image upload failed");
      }

      const imageUrl = imgbbData.data.display_url;

      // ২. ব্যাকএন্ডে বইয়ের ডাটা পাঠানো (লাইব্রেরিয়ানের ইমেইল পরে Auth থেকে বসাবেন)
      const bookData = {
        ...formData,
        deliveryFee: parseFloat(formData.deliveryFee),
        image: imageUrl,
        librarianEmail: "librarian@example.com", // TODO: Better Auth থেকে লগইন করা ইউজারের ইমেইল বসাবেন
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Book added successfully! Pending admin approval.", { id: toastId });
        // ফর্ম রিসেট করা
        setFormData({ title: "", author: "", category: "", deliveryFee: "", description: "" });
        setImageFile(null);
        setImagePreview(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add book. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 my-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <FaBook className="text-blue-600" /> Add New Book
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter book title"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter author name"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="" disabled>Select a category</option>
              <option value="Fiction">Fiction</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Academic">Academic</option>
              <option value="Biography">Biography</option>
              <option value="Self-Help">Self-Help</option>
            </select>
          </div>

          {/* Delivery Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee ($)</label>
            <input
              type="number"
              name="deliveryFee"
              value={formData.deliveryFee}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g. 5.00"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            placeholder="Write a brief description about the book..."
          ></textarea>
        </div>

        {/* Image Upload using Next Image for Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image</label>
          <div className="flex items-center gap-6">
            <label className="flex-1 flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition hover:border-blue-500 group">
              <FaCloudUploadAlt className="text-4xl text-gray-400 group-hover:text-blue-500 mb-2 transition" />
              <span className="text-sm text-gray-600 font-medium">Click to upload an image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Next.js Image Component for Preview */}
            {imagePreview && (
              <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
                <Image 
                  src={imagePreview} 
                  alt="Book Cover Preview" 
                  fill 
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl text-white font-bold text-lg transition-all flex justify-center items-center gap-2 ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Processing...
            </>
          ) : (
            "Submit Book for Approval"
          )}
        </button>
      </form>
    </div>
  );
}