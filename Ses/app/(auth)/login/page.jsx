 "use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const linkId = params?.get("linkId");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // make `e` optional and defensive — if doLogin is ever called without an event
  // we won't crash (fixes: e.preventDefault() of null).
  async function doLogin(e) {
    try {
      if (e && typeof e.preventDefault === "function") e.preventDefault();

      setError("");
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        // Prefer redirect from server but fallback to dashboard
        router.push(data.redirect || "/dashboard");
      } else {
        setError(data?.message || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unexpected error — please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          className="absolute w-[160%] h-[160%] bg-gradient-to-br from-purple-600 via-fuchsia-500 to-blue-500 blur-3xl animate-pulse opacity-40"
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-[420px] p-8 rounded-3xl backdrop-blur-xl border border-white/10 bg-white/5 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-6 text-white">
          <Sparkles size={46} className="text-purple-400 drop-shadow-lg mb-2" />
          <h2 className="text-3xl font-semibold tracking-wide">Welcome Back</h2>
          <p className="text-gray-300 text-sm mt-1">Secure login to continue</p>
        </div>

        <form onSubmit={doLogin}>
          {/* Email Field */}
          <div className="mt-2">
            <label className="flex items-center gap-2 text-gray-300 mb-1">
              <Mail size={18} />
              <span className="text-sm">Email</span>
            </label>
            <input
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
              placeholder="you@company.com"
              type="email"
              aria-label="Email"
            />
          </div>

          {/* Password Field */}
          <div className="mt-4">
            <label className="flex items-center gap-2 text-gray-300 mb-1">
              <Lock size={18} />
              <span className="text-sm">Password</span>
            </label>
            <input
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
              placeholder="••••••••"
              type="password"
              aria-label="Password"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-3 text-sm text-red-400 bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full mt-6 p-3 rounded-xl font-semibold shadow-lg tracking-wide text-white transition
              ${loading ? "bg-purple-500/80 cursor-wait" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div>Link ID: <span className="text-purple-300 font-semibold">{linkId}</span></div>
          <button
            type="button"
            onClick={() => alert('Forgot password flow not implemented')}
            className="underline"
          >
            Forgot?
          </button>
        </div>
      </motion.div>
    </div>
  );

} 

