// app/page.tsx (Next.js 13+ App Router)
// or pages/index.js if you're on Pages Router

"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-8 text-center"
      >
        Student ERP Portal
      </motion.h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Student Section */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center text-center border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Students</h2>
          <p className="text-gray-600 mb-6">
            Login or Register to access your dashboard, courses, and resources.
          </p>
          <div className="flex gap-4">
            <Link
              href="/student/login"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Login
            </Link>
            <Link
              href="/student/register"
              className="bg-gray-200 text-indigo-700 px-5 py-2 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Register
            </Link>
          </div>
        </motion.div>

        {/* Admin Section */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center text-center border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Admin</h2>
          <p className="text-gray-600 mb-6">
            Manage students, courses, and system settings from the admin panel.
          </p>
          <Link
            href="/admin/login"
            className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition"
          >
            Admin Login
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Student ERP. All rights reserved.
      </p>
    </div>
  );
}
