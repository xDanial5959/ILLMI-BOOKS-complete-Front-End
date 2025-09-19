"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const AboutUs = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main
          className={`flex-grow transition-opacity duration-500 ${
            isMounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <section
            className="bg-gray-50 py-16 md:py-24"
            aria-labelledby="about-heading"
          >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
              <div className="space-y-12 text-center">
                <h2
                  id="about-heading"
                  className="text-3xl md:text-4xl font-serif font-medium text-gray-900 tracking-tight"
                >
                  About Ilmi Books
                </h2>

                <div className="space-y-6 text-lg text-gray-700">
                  <p>
                    Founded in 1985, Ilmi Books has grown from a small bookstore
                    in Urdu Bazar to become one of Pakistan's most trusted
                    sources for educational and Islamic literature.
                  </p>

                  <p>
                    We're your comprehensive book destination, offering
                    everything from school textbooks to university references,
                    Islamic literature to bestselling novels. Whatever your
                    reading need, we've got you covered.
                  </p>

                  <p>
                    Enjoy convenient doorstep delivery across Pakistan with
                    <span className="font-semibold text-gray-900">
                      {" "}
                      Cash on Delivery (COD)
                    </span>
                    available nationwide. No upfront payment required—just pure
                    reading pleasure.
                  </p>
                </div>
              </div>

              {/* Additional Sections */}
              <div className="mt-16 grid gap-12 md:grid-cols-2">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-serif font-medium text-gray-900 mb-4">
                    Our Mission
                  </h3>
                  <p className="text-gray-700">
                    To make quality educational resources accessible to every
                    student and reader in Pakistan, while preserving and
                    promoting Islamic knowledge.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-serif font-medium text-gray-900 mb-4">
                    Our Collection
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Self-Help</li>
                    <li>• Phychology</li>
                    <li>• Finance</li>
                    <li>• Novel</li>
                    <li>• History</li>
                    <li>• Spirituality</li>
                    <li>• Islamic</li>
                    <li>• Academic</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
        <CartDrawer />
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
