"use client";

import { ChevronDown, Search, User, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation"; // Add this import

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const pathname = usePathname(); // Get current path

  const navItems = [
    { name: "Home", href: "/", dropdown: false },
    // { name: "Shop", href: "#", dropdown: true },
    // { name: "Collections", href: "#", dropdown: true },
    { name: "About Us", href: "/about-us", dropdown: false },
    // { name: "Contact", href: "#", dropdown: false },
  ];

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm  border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link href="/" className="group">
              <div className="flex items-center space-x-2">
                {/* Enhanced logo animation */}
                <img
                  src="/logo.png"
                  alt="Ilmi Books Logo"
                  className="h-14 w-24 mr-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                  transform group-hover:scale-110 group-hover:rotate-[5deg]
                  group-active:scale-95 group-active:rotate-[-5deg]"
                />

                {/* Enhanced text animation */}
                <span
                  className="text-xl font-bold font-sans tracking-tight text-gray-900 
                  transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  group-hover:text-blue-600 group-hover:scale-105
                  relative after:content-[''] after:absolute after:w-0 after:h-[2px] 
                  after:bg-gradient-to-r after:from-blue-500 after:to-blue-600 after:bottom-0 after:left-0 
                  after:transition-all after:duration-500 after:ease-out
                  group-hover:after:w-full group-hover:after:opacity-100"
                >
                  Ilmi Books
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => (
                <li key={item.name} className="relative">
                  {item.dropdown ? (
                    <div className="relative">
                      {/* ... keep existing dropdown code ... */}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`relative px-3 py-2 text-md font-medium transition-colors duration-300 group
                        ${
                          pathname === item.href
                            ? "text-blue-600" // Active link style
                            : "text-gray-700 hover:text-blue-600" // Inactive link style
                        }`}
                    >
                      {item.name}
                      <span
                        className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] 
                        ${
                          pathname === item.href
                            ? "w-4/5" // Active underline
                            : "w-0 group-hover:w-4/5" // Inactive underline
                        }`}
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Icons - Right */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-gray-700 cursor-pointer hover:text-blue-600 rounded-full hover:bg-gray-100 
              transition-all duration-300 ease-out group"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-active:animate-bounce" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white
                transition-all duration-300 ease-out group-hover:scale-110 group-hover:animate-pulse
                border-2 border-white shadow-sm"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-gray-100 
              transition-all duration-300 ease-out"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                    className="transition-all duration-300 origin-center"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                    className="transition-all duration-300 origin-center"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="space-y-1 px-4 pb-3 pt-2">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="border-b border-gray-100/50 last:border-0 transition-colors duration-200"
            >
              {item.dropdown ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex w-full items-center justify-between py-3 text-sm font-medium text-gray-700 hover:text-blue-600 
                    transition-colors duration-300"
                  >
                    {item.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`pl-4 space-y-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      activeDropdown === item.name
                        ? "max-h-96 py-2 opacity-100"
                        : "max-h-0 opacity-80"
                    }`}
                  >
                    {["New Arrivals", "Bestsellers", "Featured", "Deals"].map(
                      (subItem) => (
                        <Link
                          key={subItem}
                          href="#"
                          className="block py-2 text-sm text-gray-600 hover:text-blue-600 
                          transition-all duration-300 hover:pl-2"
                        >
                          {subItem}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`block py-3 text-sm font-medium transition-colors duration-300
                    ${
                      pathname === item.href
                        ? "text-blue-600" // Active link style
                        : "text-gray-700 hover:text-blue-600" // Inactive link style
                    }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
