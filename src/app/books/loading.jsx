// app/books/loading.jsx
export default function LoadingBooks() {
  // ৮টি ডামি আইটেম তৈরি করছি স্কেলিটন দেখানোর জন্য
  const skeletons = Array.from({ length: 8 });

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="h-10 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col h-[320px]">
            <div className="h-48 bg-gray-200 w-full"></div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="mt-auto flex justify-between border-t pt-3">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}