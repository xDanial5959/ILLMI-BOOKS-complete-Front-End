"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { bookData } from "@/data/bookData";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const BookDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const book = bookData.find((b) => b.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const relatedBooksRef = useRef(null);
  const [randomRelatedBooks, setRandomRelatedBooks] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Generate random related books when component mounts
    if (book) {
      const shuffled = [...bookData]
        .filter((b) => b.id !== book.id)
        .sort(() => 0.5 - Math.random());
      setRandomRelatedBooks(shuffled.slice(0, 10));
    }
  }, [book]);

  if (!book) return <div className="p-6 text-red-500">Book not found</div>;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const scrollRelatedBooks = (direction) => {
    const container = relatedBooksRef.current;
    const scrollAmount = 300;

    if (container) {
      if (direction === "left") {
        if (container.scrollLeft <= 0) {
          // If at start, scroll to end
          container.scrollLeft = container.scrollWidth;
        } else {
          container.scrollLeft -= scrollAmount;
        }
      } else {
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth
        ) {
          // If at end, scroll to start
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += scrollAmount;
        }
      }
    }
  };

  const handleBuyNow = () => {
    addToCart(book, quantity, true);
    router.push("/checkout");
  };

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((book.originalPrice - book.salePrice) / book.originalPrice) * 100
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Book Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Book Image */}
              <div className="relative group">
                <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-md">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {book.originalPrice > book.salePrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {book.title}
                  </h1>
                  {book.author && (
                    <p className="text-lg text-gray-600 mt-1">
                      by {book.author}
                    </p>
                  )}
                </div>

                {/* Price Section */}
                <div className="space-y-2">
                  {book.originalPrice > book.salePrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-400 line-through">
                        Rs.{book.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded">
                        Save {discountPercentage}%
                      </span>
                    </div>
                  )}
                  <p className="text-3xl font-bold text-gray-900">
                    Rs.{book.salePrice.toLocaleString()}
                  </p>
                  {book.originalPrice > book.salePrice && (
                    <p className="text-xs text-gray-500">
                      You save Rs.
                      {(book.originalPrice - book.salePrice).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  {book.category && (
                    <div>
                      <p className="font-medium">Category:</p>
                      <p>{book.category}</p>
                    </div>
                  )}
                  {book.publisher && (
                    <div>
                      <p className="font-medium">Publisher:</p>
                      <p>{book.publisher}</p>
                    </div>
                  )}
                  {book.language && (
                    <div>
                      <p className="font-medium">Language:</p>
                      <p>{book.language}</p>
                    </div>
                  )}
                  {book.pages && (
                    <div>
                      <p className="font-medium">Pages:</p>
                      <p>{book.pages}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {book.description ||
                      "This compelling book offers profound insights into its subject matter. The author's expertise shines through every chapter, making it an essential read for enthusiasts and professionals alike."}
                  </p>
                </div>

                {/* Quantity and Actions */}
                <div className="pt-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-3 cursor-pointer py-1 text-gray-600 hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-center w-12">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-3 cursor-pointer py-1 text-gray-600 hover:bg-gray-100"
                        disabled={quantity >= 10}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">Max 10 per customer</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => addToCart(book, quantity)}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      <ShoppingBag className="w-5 h-5" /> Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-blue-100 text-blue-600 rounded-full">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Home Delivery</p>
                      <p className="text-sm text-gray-600">
                        Estimated delivery by{" "}
                        {new Date(
                          Date.now() + 3 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {/* <p className="text-xs text-gray-500 mt-1">
                        Free shipping on orders over Rs.1000
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {randomRelatedBooks.length > 0 && (
              <div className="bg-gray-50 px-6 md:px-8 py-8 border-t border-gray-200 relative">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  You may also like
                </h2>

                {/* Navigation Arrows - Always visible */}
                <button
                  onClick={() => scrollRelatedBooks("left")}
                  className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="text-gray-700 w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollRelatedBooks("right")}
                  className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="text-gray-700 w-5 h-5" />
                </button>

                {/* Related Books Container */}
                <div
                  ref={relatedBooksRef}
                  className="relative overflow-x-auto scroll-smooth whitespace-nowrap space-x-4 py-2 hide-scrollbar"
                >
                  {randomRelatedBooks.map((relatedBook) => (
                    <div
                      key={relatedBook.id}
                      className="inline-block w-48 sm:w-56 md:w-64 align-top whitespace-normal cursor-pointer"
                      onClick={() => router.push(`/book/${relatedBook.id}`)}
                    >
                      <div className="group">
                        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-sm mb-2">
                          <img
                            src={relatedBook.image}
                            alt={relatedBook.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {relatedBook.title}
                        </h3>
                        {relatedBook.author && (
                          <p className="text-xs text-gray-500">
                            {relatedBook.author}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm font-bold text-gray-900">
                            Rs.{relatedBook.salePrice.toLocaleString()}
                          </p>
                          {relatedBook.originalPrice >
                            relatedBook.salePrice && (
                            <p className="text-xs text-gray-400 line-through">
                              Rs.{relatedBook.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                        {relatedBook.originalPrice > relatedBook.salePrice && (
                          <p className="text-xs text-green-600 mt-0.5">
                            Save Rs.
                            {(
                              relatedBook.originalPrice - relatedBook.salePrice
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx global>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
      <CartDrawer />
      <Footer />
    </>
  );
};

export default BookDetail;
