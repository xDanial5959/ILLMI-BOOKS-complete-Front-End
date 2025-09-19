"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  BarChart2,
  History,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => {
    return pathname === path
      ? "bg-[#033d3e] text-white shadow-md"
      : "text-[#033d3e] hover:bg-[#033d3e]/10 transition-colors";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Navbar (Sticky Header) */}
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#033d3e]/90 backdrop-blur-md shadow-lg"
            : "bg-[#033d3e]/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image
                src="/logo.png"
                alt="Ilimi Books Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-lg font-semibold text-white">Ilimi Books</h1>
          </div>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 h-screen bg-white/90 backdrop-blur-lg shadow-xl transition-all duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo/Brand */}
        <div className="p-4 border-b border-[#033d3e]/20 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.png"
                  alt="Ilimi Books Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-semibold whitespace-nowrap text-[#033d3e]">
                Ilimi Books
              </h1>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block text-[#033d3e]/60 hover:text-[#033d3e] ml-2 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
          <ul className="space-y-1">
            {[
              {
                path: "/ad/m/in/login/admin/orders",
                icon: ShoppingCart,
                label: "Orders",
              },
              {
                path: "/ad/m/in/login/admin/products",
                icon: Package,
                label: "Products",
              },
              {
                path: "/ad/m/in/login/admin/statistics",
                icon: BarChart2,
                label: "Statistics",
              },
              {
                path: "/ad/m/in/login/admin/orders/history",
                icon: History,
                label: "History",
              },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg ${isActive(
                    item.path
                  )} ${
                    isCollapsed ? "justify-center" : ""
                  } transition-colors duration-200`}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      pathname === item.path ? "text-white" : "text-[#033d3e]"
                    }`}
                  />
                  {!isCollapsed && (
                    <span
                      className={`${
                        pathname === item.path ? "text-white" : "text-[#033d3e]"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
