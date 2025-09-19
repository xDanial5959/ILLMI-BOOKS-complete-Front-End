"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Teal color palette matching your sidebar
  const colors = {
    primary: "#033d3e",
    light: "#e6f2f2",
    dark: "#022b2c",
    accent: "#046e70",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Your authentication logic here
    console.log("Logging in with:", { email, password });
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6f2f2] to-[#c4e4e4] p-4">
      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div
          className="bg-[#033d3e] p-6 text-center"
          style={{ background: colors.primary }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex justify-center mb-4"
          >
            <div className="relative h-16 w-16">
              <Image
                src="/logo.png"
                alt="Ilimi Books Logo"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-[#a3d4d4] mt-1">Sign in to your admin dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#033d3e] mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#033d3e]/70" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-[#033d3e]/20 focus:ring-2 focus:ring-[#033d3e]/50 focus:border-[#033d3e]/50 text-[#033d3e] placeholder-[#033d3e]/50"
                placeholder="admin@example.com"
                required
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#033d3e] mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#033d3e]/70" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-[#033d3e]/20 focus:ring-2 focus:ring-[#033d3e]/50 focus:border-[#033d3e]/50 text-[#033d3e] placeholder-[#033d3e]/50"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#033d3e]/50 hover:text-[#033d3e]"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/ad/m/in/login/admin" className="block">
              <button
                type="button"
                disabled={isLoading}
                className={`w-full flex cursor-pointer justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? "bg-[#033d3e]/70 cursor-not-allowed"
                    : "bg-[#033d3e] hover:bg-[#022b2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#033d3e]/50"
                } transition-all duration-200`}
                style={{
                  backgroundColor: isLoading
                    ? `${colors.primary}/70`
                    : colors.primary,
                }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
