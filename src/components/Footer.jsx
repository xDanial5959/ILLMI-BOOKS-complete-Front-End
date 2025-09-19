"use client";

import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#033d3e]  text-white pt-16 pb-5 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/noise.png')]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link
              href="/"
              className="group flex items-center space-x-3 hover:space-x-4 transition-all duration-500 ease-out"
            >
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Ilmi Books Logo"
                  className="h-14 w-24 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                  transform  group-hover:scale-105  "
                />
                <div
                  className="absolute inset-0 rounded-full border-2 border-blue-200/30 opacity-0 
                group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                ></div>
              </div>
              <span
                className="text-2xl font-bold font-sans tracking-tight text-white 
                transition-all duration-500 group-hover:text-blue-200 group-hover:drop-shadow-lg"
              >
                Ilmi Books
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed transition-all duration-300 hover:text-white/80">
              Providing quality educational resources since 1985. Your trusted
              partner in academic excellence and knowledge dissemination.
            </p>
            <div className="flex  justify-center space-x-3 pt-2">
              {[
                {
                  icon: Facebook,
                  url: "https://www.facebook.com/share/15g36bG7aX/?mibextid=wwXIfr",
                  color: "hover:text-blue-400",
                },
                {
                  icon: Instagram,
                  url: "https://www.instagram.com/css_books_store?igsh=bHRzdm42bjVjd3ly&utm_source=qr",
                  color: "hover:text-pink-500",
                },
                {
                  icon: Linkedin,
                  url: "https://www.linkedin.com/in/faizan-ali-a1983b370?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
                  color: "hover:text-blue-300",
                },
                {
                  icon: FaTiktok,
                  url: "https://www.tiktok.com/",
                  color: "hover:text-black-400",
                },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.url}
                  className={`p-2 rounded-full bg-[#055f60] text-white/90
                  transition-all duration-300 hover:scale-110 hover:bg-[#0a7a7c] ${social.color}
                  hover:shadow-lg hover:shadow-blue-200/10 transform hover:-translate-y-1`}
                  aria-label={`${social.icon.name} link`}
                >
                  <social.icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3
              className="text-lg font-semibold border-b border-[#0a7a7c] pb-2 relative 
            after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-blue-200 
            after:transition-all after:duration-500 hover:after:w-16"
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about-us" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-200 text-sm flex items-center
                    transition-all duration-500 hover:pl-3 group"
                  >
                    <span
                      className="w-2 h-2 bg-blue-200 rounded-full mr-3 opacity-0 
                      group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-125"
                    ></span>
                    <span
                      className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-blue-200 
                    after:transition-all after:duration-300 group-hover:after:w-full"
                    >
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3
              className="text-lg font-semibold border-b border-[#0a7a7c] pb-2 relative
            after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-blue-200 
            after:transition-all after:duration-500 hover:after:w-16"
            >
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center group">
                <div className="relative mr-3">
                  <Phone
                    className="h-5 w-5 text-blue-200 flex-shrink-0 transition-all 
                  duration-500 group-hover:scale-110 group-hover:text-white"
                  />
                  <div
                    className="absolute inset-0 rounded-full bg-blue-200/10 opacity-0 
                  group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"
                  ></div>
                </div>
                <span className="text-gray-300 text-sm">
                  <a
                    href="tel:03474974948"
                    className="hover:text-blue-200 transition-all duration-300 
                    hover:underline underline-offset-4 decoration-blue-200/50"
                  >
                    0347-4974948
                  </a>
                </span>
              </li>
              <li className="flex items-center group">
                <div className="relative mr-3">
                  <Mail
                    className="h-5 w-5 text-blue-200 flex-shrink-0 transition-all 
                  duration-500 group-hover:scale-110 group-hover:text-white"
                  />
                  <div
                    className="absolute inset-0 rounded-full bg-blue-200/10 opacity-0 
                  group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"
                  ></div>
                </div>
                <span className="text-gray-300 text-sm">
                  <a
                    href="mailto:Kitabbazar980@gmail.com"
                    className="hover:text-blue-200 transition-all duration-300 
                    hover:underline underline-offset-4 decoration-blue-200/50"
                  >
                    Kitabbazar980@gmail.com
                  </a>
                </span>
              </li>
              <li className="flex items-center group">
                <div className="relative mr-3">
                  <MessageCircle
                    className="h-5 w-5 text-blue-200 flex-shrink-0 transition-all 
                  duration-500 group-hover:scale-110 group-hover:text-white"
                  />
                  <div
                    className="absolute inset-0 rounded-full bg-blue-200/10 opacity-0 
                  group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"
                  ></div>
                </div>
                <span className="text-gray-300 text-sm">
                  <a
                    href="https://wa.me/923474974948"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-200 transition-all duration-300 
                    hover:underline underline-offset-4 decoration-blue-200/50"
                  >
                    WhatsApp: 0347-4974948
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* All rights reserved */}
        <div className="mt-12 text-center  text-gray-300 text-sm">
          © {new Date().getFullYear()} Developed by Nexus Devs Sol
        </div>
      </div>
    </footer>
  );
};

export default Footer;
