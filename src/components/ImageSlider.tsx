"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const ImageSlider = () => {
  const slides = [
    {
      id: 1,
      url: "/Bannerr 1.jpg",
      alt: "Desert landscape",
    },
    {
      id: 2,
      url: "/Bannerr 2.jpg",
      alt: "Mountain view",
    },
    {
      id: 3,
      url: "/Bannerr 3.jpg",
      alt: "Beach sunset",
    },
    {
      id: 4,
      url: "/Bannerr 4.jpg",
      alt: "Ocean waves",
    },
  ];

  const quotes = [
    // Quran Verses
    {
      id: 1,
      text: "Read! In the name of your Lord who created.",
      author: "Quran 96:1 (Al-Alaq)",
      type: "quran",
    },
    {
      id: 2,
      text: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?",
      author: "Quran 54:17 (Al-Qamar)",
      type: "quran",
    },
    {
      id: 3,
      text: "This is the Book about which there is no doubt, a guidance for those conscious of Allah.",
      author: "Quran 2:2 (Al-Baqarah)",
      type: "quran",
    },

    // Hadith
    {
      id: 4,
      text: "The best among you are those who learn the Quran and teach it.",
      author: "Sahih al-Bukhari",
      type: "hadith",
    },
    {
      id: 5,
      text: "Seek knowledge from the cradle to the grave.",
      author: "Prophet Muhammad (PBUH)",
      type: "hadith",
    },
    {
      id: 6,
      text: "The ink of the scholar is more sacred than the blood of the martyr.",
      author: "Prophet Muhammad (PBUH)",
      type: "hadith",
    },

    // Classic Literature Quotes
    {
      id: 7,
      text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
      author: "George R.R. Martin",
      type: "literature",
    },
    {
      id: 8,
      text: "There is no friend as loyal as a book.",
      author: "Ernest Hemingway",
      type: "literature",
    },
    {
      id: 9,
      text: "Books are a uniquely portable magic.",
      author: "Stephen King",
      type: "literature",
    },

    // Educational Quotes
    {
      id: 10,
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss",
      type: "education",
    },
    {
      id: 11,
      text: "Reading is to the mind what exercise is to the body.",
      author: "Joseph Addison",
      type: "education",
    },
    {
      id: 12,
      text: "Today a reader, tomorrow a leader.",
      author: "Margaret Fuller",
      type: "education",
    },

    // Philosophical Quotes
    {
      id: 13,
      text: "A book is a dream that you hold in your hand.",
      author: "Neil Gaiman",
      type: "philosophy",
    },
    {
      id: 14,
      text: "Books are mirrors: you only see in them what you already have inside you.",
      author: "Carlos Ruiz Zafón",
      type: "philosophy",
    },
    {
      id: 15,
      text: "I cannot live without books.",
      author: "Thomas Jefferson",
      type: "philosophy",
    },

    // Islamic Scholars
    {
      id: 16,
      text: "The seeking of knowledge is obligatory for every Muslim.",
      author: "Imam Al-Bayhaqi",
      type: "islamic",
    },
    {
      id: 17,
      text: "Knowledge enlivens the soul.",
      author: "Imam Ali (RA)",
      type: "islamic",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [sliderHeight, setSliderHeight] = useState(640);
  const [isMounted, setIsMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isQuoteTransitioning, setIsQuoteTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const quoteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateHeight = useCallback(() => {
    if (typeof window === "undefined") return 640;
    const maxHeight = Math.min(window.innerHeight * 0.8, 800);
    const aspectRatio = 16 / 9;
    const calculatedHeight = Math.min(
      window.innerWidth / aspectRatio,
      maxHeight
    );
    return Math.max(calculatedHeight, 300);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    setSliderHeight(calculateHeight());

    const handleResize = () => {
      setSliderHeight(calculateHeight());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateHeight]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }, [slides.length, isTransitioning]);

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (slideIndex: number) => {
    if (isTransitioning || slideIndex === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(slideIndex);
  };

  const nextQuote = useCallback(() => {
    setIsQuoteTransitioning(true);
    setCurrentQuoteIndex((prevIndex) =>
      prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
    );

    if (quoteTimeoutRef.current) {
      clearTimeout(quoteTimeoutRef.current);
    }
    quoteTimeoutRef.current = setTimeout(() => {
      setIsQuoteTransitioning(false);
    }, 1000);
  }, [quotes.length]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        nextSlide();
        nextQuote();
      }, 3000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [currentIndex, isAutoPlaying, nextSlide, nextQuote]);

  useEffect(() => {
    if (isTransitioning) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 1200);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isTransitioning]);

  const getSlideAnimationClass = (slideIndex: number) => {
    if (currentIndex === slideIndex) {
      return "opacity-100 blur-0 will-change-auto";
    }
    return "opacity-0 blur-sm will-change-auto";
  };

  return (
    <div className="w-full mx-auto">
      {/* Combined Slider with Quotes Overlay */}
      <div
        className={`relative w-full mx-auto overflow-hidden will-change-transform ${
          isMounted ? "animate-fadeInScale" : "opacity-0 scale-95"
        }`}
        style={{ height: `${sliderHeight}px` }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        onTouchStart={() => setIsAutoPlaying(false)}
        onTouchEnd={() => setIsAutoPlaying(true)}
      >
        {/* Slides Container */}
        <div className="relative w-full h-full overflow-hidden">
          {slides.map((slide, slideIndex) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${getSlideAnimationClass(
                slideIndex
              )}`}
            >
              {/* Background image without blur */}
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                className="object-cover" // Removed blur effect
                priority={currentIndex === slideIndex}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
              />

              {/* Green overlay instead of dark overlay */}
              <div className="absolute inset-0 bg-green-900/30"></div>
            </div>
          ))}
        </div>
        {/* Quotes Overlay - Positioned absolutely over the slides */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative w-full max-w-6xl px-4 md:px-6">
            {quotes.map((quote, index) => (
              <div
                key={quote.id}
                className={`text-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  currentQuoteIndex === index
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 absolute top-0 left-0 right-0"
                } ${isQuoteTransitioning ? "scale-95" : "scale-100"}`}
              >
                <div className="inline-block bg-[#033d3e]/40 backdrop-blur-sm px-6 py-4 md:px-8 md:py-6 rounded-lg">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg">
                    <span className="text-yellow-300">"</span>
                    <span
                      className={`inline-block ${
                        currentQuoteIndex === index ? "animate-textGlow" : ""
                      }`}
                      style={{
                        textShadow:
                          currentQuoteIndex === index
                            ? "0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(255,215,0,0.6)"
                            : "none",
                      }}
                    >
                      {quote.text}
                    </span>
                    <span className="text-yellow-300">"</span>
                  </p>
                  <p className="text-sm md:text-base lg:text-lg text-yellow-200 italic">
                    — {quote.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Navigation Dots - Positioned at the top */}
        <div className="absolute top-4 left-0 right-0 flex justify-center items-center z-20 space-x-2 pointer-events-auto">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuoteIndex(index);
                setIsQuoteTransitioning(true);
                setTimeout(() => setIsQuoteTransitioning(false), 700);
              }}
              className={`relative rounded-full transition-all duration-300 ease-out ${
                currentQuoteIndex === index
                  ? "w-4 h-2 bg-yellow-300 shadow-[0_0_8px_2px_rgba(255,215,0,0.7)]"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows - Now Responsive */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 cursor-pointer top-1/2 -translate-y-1/2 z-20 bg-white/10 text-white p-2 sm:p-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-lg border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-50"
          aria-label="Previous slide"
          disabled={isTransitioning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform duration-300 hover:scale-125"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 cursor-pointer sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 text-white p-2 sm:p-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-lg border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-50"
          aria-label="Next slide"
          disabled={isTransitioning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform duration-300 hover:scale-125"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        {/* Slide Dot Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-20 space-x-2 md:space-x-3">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(slideIndex)}
              className={`relative rounded-full transition-all duration-500 ease-out ${
                currentIndex === slideIndex
                  ? "w-6 h-2 md:w-8 md:h-2 bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"
                  : "w-2 h-2 md:w-3 md:h-3 bg-white/50 hover:bg-white/70 hover:shadow-[0_0_8px_1px_rgba(255,255,255,0.3)]"
              }`}
              aria-label={`Go to slide ${slideIndex + 1}`}
              disabled={isTransitioning}
            >
              {currentIndex === slideIndex && (
                <span className="absolute top-0 left-0 h-full bg-white/30 rounded-full animate-pulse duration-1000" />
              )}
            </button>
          ))}
        </div>

        {/* Add custom animation to Tailwind config */}
        <style jsx global>{`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.98);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeInScale {
            animation: fadeInScale 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          @keyframes textGlow {
            0% {
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.5),
                0 0 10px rgba(255, 215, 0, 0.3);
            }
            50% {
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(255, 215, 0, 0.6);
            }
            100% {
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.5),
                0 0 10px rgba(255, 215, 0, 0.3);
            }
          }
          .animate-textGlow {
            animation: textGlow 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ImageSlider;
