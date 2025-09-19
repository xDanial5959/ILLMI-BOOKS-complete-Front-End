"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const ImageSlider = () => {
  const slides = [
    { id: 1, url: "/Bannerr 1.jpg", alt: "Desert landscape" },
    { id: 2, url: "/Bannerr 2.jpg", alt: "Mountain view" },
    { id: 3, url: "/Bannerr 3.jpg", alt: "Beach sunset" },
    { id: 4, url: "/Bannerr 4.jpg", alt: "Ocean waves" },
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
      text: "The more that you read, the more things you will know. The more that you learn, the more places you&apos;ll go.",
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

    const handleResize = () => setSliderHeight(calculateHeight());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateHeight]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  }, [slides.length, isTransitioning]);

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const goToSlide = (i: number) => {
    if (isTransitioning || i === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(i);
  };

  const nextQuote = useCallback(() => {
    setIsQuoteTransitioning(true);
    setCurrentQuoteIndex((prev) =>
      prev === quotes.length - 1 ? 0 : prev + 1
    );

    if (quoteTimeoutRef.current) clearTimeout(quoteTimeoutRef.current);
    quoteTimeoutRef.current = setTimeout(
      () => setIsQuoteTransitioning(false),
      1000
    );
  }, [quotes.length]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        nextSlide();
        nextQuote();
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isAutoPlaying, nextSlide, nextQuote]);

  useEffect(() => {
    if (isTransitioning) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => setIsTransitioning(false),
        1200
      );
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [isTransitioning]);

  const getSlideAnimationClass = (i: number) =>
    currentIndex === i
      ? "opacity-100 blur-0 will-change-auto"
      : "opacity-0 blur-sm will-change-auto";

  return (
    <div className="w-full mx-auto">
      {/* Slider Container */}
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
        {/* Slides */}
        <div className="relative w-full h-full overflow-hidden">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${getSlideAnimationClass(i)}`}
            >
              <Image
                src={s.url}
                alt={s.alt}
                fill
                className="object-cover"
                priority={currentIndex === i}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
              />
              <div className="absolute inset-0 bg-green-900/30" />
            </div>
          ))}
        </div>

        {/* Quotes */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative w-full max-w-6xl px-4 md:px-6">
            {quotes.map((q, i) => (
              <div
                key={q.id}
                className={`text-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  currentQuoteIndex === i
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 absolute top-0 left-0 right-0"
                } ${isQuoteTransitioning ? "scale-95" : "scale-100"}`}
              >
                <div className="inline-block bg-[#033d3e]/40 backdrop-blur-sm px-6 py-4 md:px-8 md:py-6 rounded-lg">
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg">
                    <span className="text-yellow-300">&quot;</span>
                    <span
                      className={`inline-block ${
                        currentQuoteIndex === i ? "animate-textGlow" : ""
                      }`}
                      style={{
                        textShadow:
                          currentQuoteIndex === i
                            ? "0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(255,215,0,0.6)"
                            : "none",
                      }}
                    >
                      {q.text}
                    </span>
                    <span className="text-yellow-300">&quot;</span>
                  </p>
                  <p className="text-sm md:text-base lg:text-lg text-yellow-200 italic">
                    — {q.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Dots */}
        <div className="absolute top-4 left-0 right-0 flex justify-center z-20 space-x-2">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentQuoteIndex(i);
                setIsQuoteTransitioning(true);
                setTimeout(() => setIsQuoteTransitioning(false), 700);
              }}
              className={`rounded-full transition-all ${
                currentQuoteIndex === i
                  ? "w-4 h-2 bg-yellow-300 shadow-[0_0_8px_2px_rgba(255,215,0,0.7)]"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 text-white p-2 sm:p-3 rounded-full hover:bg-white/20 transition-all backdrop-blur-lg border border-white/10"
          disabled={isTransitioning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 sm:w-6 sm:h-6"
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
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 text-white p-2 sm:p-3 rounded-full hover:bg-white/20 transition-all backdrop-blur-lg border border-white/10"
          disabled={isTransitioning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        {/* Slide Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20 space-x-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all ${
                currentIndex === i
                  ? "w-6 h-2 bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Animations */}
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
            animation: fadeInScale 800ms ease forwards;
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
