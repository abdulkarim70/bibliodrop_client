import { FaUser, FaTag, FaMoneyBillWave } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// স্পেসিফিক বইয়ের ডাটা ফেচ করার ফাংশন
async function getBookDetails(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export default async function BookDetailsPage({ params }) {
  const { id } = params;
  const book = await getBookDetails(id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-red-500">Book not found!</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Book Cover */}
        <div className="md:w-2/5 bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
          {book.image ? (
            <div className="relative w-full max-w-sm aspect-[3/4]">
              <Image 
                src={book.image} 
                alt={book.title} 
                width={400}
                height={533}
                sizes="(max-width: 768px) 100vw, 400px"
                className="w-full h-auto rounded-lg shadow-md object-cover"
                priority // পেজের মেইন ইমেজ বা অ্যাভোভ-দ্য-ফোল্ড কন্টেন্ট হওয়ায় দ্রুত লোডের জন্য priority ব্যবহার করা হয়েছে
              />
            </div>
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 font-medium">No Image Available</span>
            </div>
          )}
        </div>

        {/* Right Side: Book Information */}
        <div className="md:w-3/5 p-8 flex flex-col justify-center">
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
              {book.category || "General"}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{book.title}</h1>
          
          <div className="space-y-3 mb-6 text-gray-600">
            <p className="flex items-center gap-2 text-lg">
              <FaUser className="text-gray-400" /> 
              <span className="font-medium text-gray-800">Author:</span> {book.author}
            </p>
            <p className="flex items-center gap-2">
              <FaTag className="text-gray-400" /> 
              <span className="font-medium text-gray-800">Status:</span> 
              <span className={`font-semibold ${book.status === 'Available' ? 'text-green-600' : 'text-orange-500'}`}>
                {book.status || "Available"}
              </span>
            </p>
            <p className="flex items-center gap-2 text-xl font-bold text-green-600 mt-4">
              <FaMoneyBillWave className="text-green-500" />
              Delivery Fee: ${book.deliveryFee}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {book.description || "No description provided for this book."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-auto">
            <button 
              disabled={book.status === "Checked Out"}
              className={`flex-1 py-3 px-6 rounded-xl text-white font-bold text-lg transition-all ${
                book.status === "Checked Out" 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
              }`}
            >
              Request Delivery
            </button>
            <Link 
              href="/books"
              className="flex-1 text-center py-3 px-6 rounded-xl bg-gray-100 text-gray-700 font-bold text-lg hover:bg-gray-200 transition-all"
            >
              Back to Browse
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}