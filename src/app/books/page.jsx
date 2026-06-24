import { FaBookOpen, FaSadTear, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

// ডাটা ফেচ করার ফাংশন (Pagination সহ)
async function getBooks(pageIndex) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?page=${pageIndex}&size=6`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching books:", error);
    return { data: [], totalBooks: 0 }; // Error হলে ফাঁকা ডাটা রিটার্ন করবে
  }
}

export default async function BrowseBooksPage({ searchParams }) {
  // URL থেকে current page বের করা (ডিফল্ট: 0)
  const currentPage = parseInt(searchParams.page) || 0;
  
  // ব্যাকএন্ড থেকে ডাটা আনা
  const { data: books, totalBooks } = await getBooks(currentPage);
  
  // মোট কয়টি পেজ হবে তার হিসাব (প্রতি পেজে ৬টি করে বই)
  const totalPages = Math.ceil(totalBooks / 6);

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen flex flex-col">
      {/* Page Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-3 text-gray-800">
          <FaBookOpen className="text-blue-600" />
          Browse Books
        </h1>
        <p className="text-gray-500 mt-2">Explore our collection and find your next read.</p>
      </div>

      {/* Empty State */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 flex-grow">
          <FaSadTear className="text-5xl mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold">No books available right now.</h3>
          <p>Please check back later!</p>
        </div>
      ) : (
        <>
          {/* Book Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-grow">
            {books.map((book) => (
              <div 
                key={book._id} 
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-col"
              >
                <div className="h-48 bg-gray-100 w-full flex items-center justify-center overflow-hidden">
                  {book.image ? (
                     <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <FaBookOpen className="text-gray-300 text-4xl" />
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full w-max mb-2">
                    {book.category || "General"}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">By {book.author}</p>
                  
                  <div className="mt-auto flex items-center justify-between border-t pt-3">
                    <p className="text-lg font-bold text-green-600">${book.deliveryFee}</p>
                    {book.status === "Checked Out" ? (
                      <span className="text-xs font-semibold text-red-500 bg-red-100 px-2 py-1 rounded-md">Unavailable</span>
                    ) : (
                      <Link 
                        href={`/books/${book._id}`}
                        className="text-sm font-medium text-white bg-[#6a46cd] hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
                      >
                        Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 mb-6">
              {/* Previous Button */}
              {currentPage > 0 ? (
                <Link 
                  href={`/books?page=${currentPage - 1}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm font-medium"
                >
                  <FaChevronLeft className="text-sm" /> Prev
                </Link>
              ) : (
                <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed font-medium">
                  <FaChevronLeft className="text-sm" /> Prev
                </button>
              )}

              {/* Page Indicator */}
              <span className="font-semibold text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>

              {/* Next Button */}
              {currentPage < totalPages - 1 ? (
                <Link 
                  href={`/books?page=${currentPage + 1}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm font-medium"
                >
                   Next <FaChevronRight className="text-sm" />
                </Link>
              ) : (
                <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed font-medium">
                  Next <FaChevronRight className="text-sm" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}