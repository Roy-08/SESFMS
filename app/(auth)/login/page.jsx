"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function doLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        const userRole = data.user?.role;
        const userLinkId = data.user?.linkId;

        if (userRole === "user" && userLinkId) {
          router.push(`/login/${userLinkId}`);
        } else {
          router.push(data.redirect || "/dashboard");
        }
      } else {
        setError(data?.message || "Login failed");
      }
    } catch {
      setError("Unexpected error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-fuchsia-600/30 to-blue-600/40 blur-3xl" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-[420px] rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(168,85,247,0.25)]"
      >
        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg">
            <img
              src="/sign.png"
              alt="Sign"
              className="w-10 h-10 object-contain"
            />
          </div>

          <h1 className="text-3xl font-semibold text-white tracking-wide">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-400 text-sm">
            Secure login to continue
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Form */}
        <form onSubmit={doLogin} className="px-8 py-8">
          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-1">
              <Mail size={16} />
              <span className="text-sm">Email</span>
            </label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@company.com"
              className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="flex items-center gap-2 text-gray-300 mb-1">
              <Lock size={16} />
              <span className="text-sm">Password</span>
            </label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 text-sm text-red-400 bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}

          {/* Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.03 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            className={`w-full mt-6 py-3 rounded-xl text-white font-medium tracking-wide transition
              ${
                loading
                  ? "bg-purple-600/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-90"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
