import { FaBookOpen, FaSadTear } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// ডাটা ফেচ করার ফাংশন
async function getBooks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
      cache: "no-store", // রিয়েল-টাইম ডাটা নিশ্চিত করতে
    });
    
    if (!res.ok) throw new Error("Failed to fetch data");
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default async function BrowseBooksPage() {
  const books = await getBooks();

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      {/* Page Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-3 text-gray-800">
          <FaBookOpen className="text-blue-600" />
          Browse Books
        </h1>
        <p className="text-gray-500 mt-2">Explore our collection and find your next read.</p>
      </div>

      {/* Empty State (যদি কোনো বই না থাকে) */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <FaSadTear className="text-5xl mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold">No books available right now.</h3>
          <p>Please check back later!</p>
        </div>
      ) : (
        /* Book Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div 
              key={book._id} 
              className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gray-200 w-full flex items-center justify-center overflow-hidden">
                {book.image ? (
                  <Image 
                    src={book.image} 
                    alt={book.title} 
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                    priority={false} // প্রথম সারির ইমেজের জন্য প্রয়োজনে true করতে পারেন
                  />
                ) : (
                  <FaBookOpen className="text-gray-400 text-4xl" />
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Category Badge */}
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full w-max mb-2">
                  {book.category || "General"}
                </span>
                
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-1">By {book.author}</p>
                
                {/* Footer Section of Card */}
                <div className="mt-auto flex items-center justify-between border-t pt-3">
                  <p className="text-lg font-bold text-green-600">${book.deliveryFee}</p>
                  
                  {book.status === "Checked Out" ? (
                    <span className="text-xs font-semibold text-red-500 bg-red-100 px-2 py-1 rounded-md">
                      Unavailable
                    </span>
                  ) : (
                    <Link 
                      href={`/books/${book._id}`}
                      className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
                    >
                      Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}