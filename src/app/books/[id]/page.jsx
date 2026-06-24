import LibrarianActionButtons from "@/components/LibrarianActionButtons";
import UserActionButtons from "@/components/UserActionButtons"; // নতুন কম্পোনেন্ট ইমপোর্ট করা হলো
import { getCurrentUser } from "@/lib/auth-server";
import { 
  FaUser, 
  FaTag, 
  FaMoneyBillWave, 
  FaSignInAlt, 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaStar,
  FaTimesCircle
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image"; 

async function getBookDetails(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
      cache: "no-store", 
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

export default async function BookDetailsPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const book = await getBookDetails(id);
  const currentUser = await getCurrentUser();

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Book not found!</h2>
          <Link href="/books" className="text-blue-600 hover:underline font-medium">
            &larr; Go back to Browse Books
          </Link>
        </div>
      </div>
    );
  }

  // শর্ত চেক করা
  const isOwner = currentUser?.email === book.librarianEmail;
  const isCheckedOut = book.status === "Checked Out";
  const formattedDate = book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "N/A";

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen py-12">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Book Cover */}
        <div className="md:w-2/5 bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative min-h-[400px]">
          {book.image ? (
            <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300">
              <Image 
                src={book.image} 
                alt={book.title} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority 
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full h-[450px] bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-400 font-medium text-lg">No Image Available</span>
            </div>
          )}
        </div>

        {/* Right Side: Information & Actions */}
        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
              {book.category || "General"}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {book.title}
          </h1>
          
          {/* Metadata Section */}
          <div className="space-y-4 mb-8 text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="flex items-center gap-3 text-lg">
              <FaUser className="text-gray-400 text-xl" /> 
              <span className="font-semibold text-gray-800">Author:</span> {book.author}
            </p>
            <p className="flex items-center gap-3 text-lg">
              <FaCalendarAlt className="text-gray-400 text-xl" /> 
              <span className="font-semibold text-gray-800">Date Added:</span> {formattedDate}
            </p>
            <p className="flex items-center gap-3 text-lg">
              <FaTag className="text-gray-400 text-xl" /> 
              <span className="font-semibold text-gray-800">Status:</span> 
              <span className={`font-bold flex items-center gap-1 ${!isCheckedOut ? 'text-green-600' : 'text-red-500'}`}>
                {!isCheckedOut ? <><FaCheckCircle /> Available</> : <><FaTimesCircle /> Checked Out</>}
              </span>
            </p>
            <p className="flex items-center gap-3 text-2xl font-black text-green-600 mt-2">
              <FaMoneyBillWave className="text-green-500" />
              Delivery Fee: ${book.deliveryFee}
            </p>
          </div>

          <div className="mb-10 flex-grow">
            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {book.description || "No description provided for this book."}
            </p>
          </div>

          {/* Dynamic Action Buttons */}
          {isOwner ? (
            <LibrarianActionButtons bookId={book._id} />
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              {!currentUser ? (
                <Link 
                  href="/auth/login" 
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-bold text-lg bg-[#6a46cd] hover:bg-blue-700 shadow-md hover:shadow-xl transition-all"
                >
                  <FaSignInAlt className="text-xl" />
                  Login to Request Delivery
                </Link>
              ) : (
                // নতুন Client Component কল করা হলো
                <UserActionButtons book={book} currentUser={currentUser} />
              )}
            </div>
          )}

        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
          <FaStar className="text-yellow-400" /> Reader Reviews
        </h2>
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this book after receiving it!</p>
        </div>
      </div>

    </div>
  );
}