"use client";

import React, { useState, useEffect, useRef } from "react";
import { bookData } from "../data/bookData";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const BookCard = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  // Create refs for dropdown containers and buttons
  const categoryDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const categoryButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  // Get all unique categories
  const categories = ["all", ...new Set(bookData.map((book) => book.category))];

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close category dropdown if clicked outside
      if (
        isCategoryOpen &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target) &&
        !categoryButtonRef.current.contains(event.target)
      ) {
        setIsCategoryOpen(false);
      }

      // Close sort dropdown if clicked outside
      if (
        isSortOpen &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target) &&
        !sortButtonRef.current.contains(event.target)
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryOpen, isSortOpen]);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setIsLoading(false);
    }, 1000);
  };

  // Filter and sort books
  const filteredBooks = bookData.filter(
    (book) => selectedCategory === "all" || book.category === selectedCategory
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        return a.salePrice - b.salePrice;
      case "price-high-low":
        return b.salePrice - a.salePrice;
      default:
        return 0;
    }
  });

  const visibleBooks = sortedBooks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBooks.length;

  const handleBookClick = (id) => {
    router.push(`/book/${id}`);
  };

  return (
    <>
      <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <div className="w-full max-w-screen-2xl">
          {/* Premium Filter and Sort UI */}
          <div className="flex   sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Category Filter Dropdown */}
            <div className="relative group" ref={categoryDropdownRef}>
              <button
                ref={categoryButtonRef}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsSortOpen(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 cursor-pointer text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm cursor-pointer font-medium text-gray-700">
                  {selectedCategory === "all"
                    ? "All Categories"
                    : selectedCategory}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute z-30 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/10 backdrop-blur-sm transition-all duration-200 ease-out ${
                  isCategoryOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="p-2 space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsCategoryOpen(false);
                      }}
                      className={`flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                        selectedCategory === category
                          ? "bg-blue-50/80 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50/80"
                      }`}
                    >
                      {category === "all" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {category}
                      {selectedCategory === category && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group" ref={sortDropdownRef}>
              <button
                ref={sortButtonRef}
                className="flex items-center  gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsCategoryOpen(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 cursor-pointer w-5 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                </svg>
                <span className="text-sm  cursor-pointer font-medium text-gray-700">
                  {sortOption === "default"
                    ? "Sort by"
                    : sortOption === "price-low-high"
                    ? "Price: Low to High"
                    : "Price: High to Low"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute  right-0 z-30 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/10 backdrop-blur-sm transition-all duration-200 ease-out ${
                  isSortOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setSortOption("default");
                      setIsSortOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                      sortOption === "default"
                        ? "bg-blue-50/80 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50/80"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Default
                    {sortOption === "default" && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSortOption("price-low-high");
                      setIsSortOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                      sortOption === "price-low-high"
                        ? "bg-blue-50/80 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50/80"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h7a1 1 0 100-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm12-3a1 1 0 10-2 0v6.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Price: Low to High
                    {sortOption === "price-low-high" && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSortOption("price-high-low");
                      setIsSortOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                      sortOption === "price-high-low"
                        ? "bg-blue-50/80 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50/80"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h7a1 1 0 100-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm12-3a1 1 0 10-2 0v6.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V7z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M15 7a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Price: High to Low
                    {sortOption === "price-high-low" && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid (unchanged) */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
            {visibleBooks.map((book) => {
              const discountPercentage = Math.round(
                ((book.originalPrice - book.salePrice) / book.originalPrice) *
                  100
              );

              return (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book.id)}
                  className="group relative w-full rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-300 p-3 bg-white transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 hover:scale-[1.01] cursor-pointer"
                >
                  {/* Discount Badge with shine effect */}
                  {book.originalPrice > book.salePrice && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm transition-all duration-300 group-hover:from-orange-600 group-hover:to-amber-600 group-hover:shadow-md z-10">
                      {discountPercentage}% OFF
                      <span className="absolute top-0 left-0 w-1/3 h-full bg-white/30 -skew-x-12 animate-shine pointer-events-none" />
                    </span>
                  )}

                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]" />
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="mt-4 px-1 pb-1 space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                      {book.title}
                    </h3>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-400 text-xs line-through">
                          Rs.{book.originalPrice.toLocaleString()}.00
                        </p>
                        <p className="text-green-600 font-semibold text-sm">
                          Rs.{book.salePrice.toLocaleString()}.00
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-0.5">
                        You save Rs.
                        {(book.originalPrice - book.salePrice).toLocaleString()}
                        .00
                      </span>
                    </div>

                    <button
                      className="w-full mt-2 py-2 cursor-pointer bg-blue-600 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-700 shadow-md hover:shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(book, 1);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rest of the component remains unchanged */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="electric-loader">
                <div className="electric-line"></div>
                <div className="electric-dots">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="electric-dot"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
                <div className="electric-sparkle"></div>
              </div>
              <p className="mt-4 text-sm font-medium text-blue-500 animate-pulse">
                Charging up more books...
              </p>
            </div>
          )}

          {hasMore && !isLoading && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="relative px-8 py-3 cursor-pointer bg-gradient-to-r from-[#033d3e] to-[#045859] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[#022c2d] hover:to-[#033d3e] transform hover:-translate-y-1 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Load More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-y-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#045859] to-[#067a7c] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Keep the existing styles */}
      <style jsx global>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          20% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }

        /* Electric Loader Styles */
        .electric-loader {
          position: relative;
          width: 200px;
          height: 60px;
        }

        .electric-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            90deg,
            rgba(58, 123, 213, 0) 0%,
            #3a7bd5 50%,
            rgba(58, 123, 213, 0) 100%
          );
          filter: drop-shadow(0 0 6px #3a7bd5);
          animation: electric-pulse 1.5s infinite;
        }

        .electric-dots {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 20px;
        }

        .electric-dot {
          width: 12px;
          height: 12px;
          background: #4facfe;
          border-radius: 50%;
          transform: translateY(0);
          animation: electric-bounce 0.8s infinite alternate;
          filter: drop-shadow(0 0 4px #4facfe);
        }

        .electric-sparkle {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 20px;
          background: #fff;
          border-radius: 2px;
          filter: blur(1px) drop-shadow(0 0 4px #fff);
          animation: electric-spark 0.8s infinite;
        }

        @keyframes electric-pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes electric-bounce {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-30px);
            background: #00f2fe;
          }
        }

        @keyframes electric-spark {
          0%,
          100% {
            height: 10px;
            opacity: 0.5;
          }
          50% {
            height: 30px;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default BookCard;
