"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaEdit, FaSpinner } from "react-icons/fa";

export default function EditBookPage() {
  const router = useRouter();
  const { id } = useParams(); // URL থেকে ডাইনামিক ID নেওয়া

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    deliveryFee: "",
    description: "",
  });

  // পেজ লোড হওয়ার সময় পুরনো ডাটা ফেচ করা
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);
        const data = await res.json();

        if (data.success) {
          const book = data.data;
          setFormData({
            title: book.title,
            author: book.author,
            category: book.category,
            deliveryFee: book.deliveryFee,
            description: book.description,
          });
          setOldImageUrl(book.image);
          setImagePreview(book.image); // প্রিভিউতে পুরনো ছবি দেখানো
        } else {
          toast.error("Failed to load book data");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
      } finally {
        setFetchingData(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating book details...");

    try {
      let finalImageUrl = oldImageUrl; // ডিফল্টভাবে পুরনো ছবির লিংক থাকবে

      // যদি ইউজার নতুন ছবি সিলেক্ট করে, তবেই imgBB তে আপলোড হবে
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: "POST", body: imageFormData }
        );
        const imgbbData = await imgbbRes.json();

        if (!imgbbData.success) throw new Error("Image upload failed");
        finalImageUrl = imgbbData.data.display_url;
      }

      // ব্যাকএন্ডে আপডেট করা ডাটা পাঠানো
      const updatedBookData = {
        ...formData,
        deliveryFee: parseFloat(formData.deliveryFee),
        image: finalImageUrl,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBookData),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Book updated successfully!", { id: toastId });
        router.push(`/books/${id}`); // আপডেট হওয়ার পর Book Details পেজে পাঠিয়ে দেবে
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update book.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 my-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <FaEdit className="text-blue-600" /> Edit Book Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
            >
              <option value="Fiction">Fiction</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Academic">Academic</option>
              <option value="Biography">Biography</option>
              <option value="Self-Help">Self-Help</option>
            </select>
          </div>

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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image (Optional)</label>
          <div className="flex items-center gap-6">
            <label className="flex-1 flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition hover:border-blue-500 group">
              <FaCloudUploadAlt className="text-4xl text-gray-400 group-hover:text-blue-500 mb-2 transition" />
              <span className="text-sm text-gray-600 font-medium">Click to upload a new image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

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

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl text-white font-bold text-lg transition-all flex justify-center items-center gap-2 ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Saving Changes...
            </>
          ) : (
            "Update Book"
          )}
        </button>
      </form>
    </div>
  );
}