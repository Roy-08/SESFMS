"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function LinkLoginPage() {
  const { linkId } = useParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/getUserByLinkId?linkId=${linkId}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Invalid login link");
          return;
        }

        setEmail(data.email);
        setFirstTime(!data.firstTimePasswordSet);
      } catch {
        toast.error("Unable to load user");
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, [linkId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (firstTime && password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (firstTime) {
        await fetch("/api/setUserPassword", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      }

      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        toast.error("Login failed");
        return;
      }

      router.push(`/login/${linkId}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return <div className="text-white text-center mt-40">Loading...</div>;
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
    className="w-13 h-13 object-contain"
  />
</div>


          <h1 className="text-3xl font-semibold text-white tracking-wide">
            {firstTime ? "Create Password" : "Welcome Back"}
          </h1>

          <p className="mt-2 text-gray-400 text-sm">
            Signed in as
          </p>
          <p className="text-purple-300 text-sm font-medium">
            {email}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              {firstTime ? "New Password" : "Password"}
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {firstTime && (
            <div className="mt-4">
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                required
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          )}

          <motion.button
  disabled={loading}
  whileHover={!loading ? { scale: 1.03 } : {}}
  whileTap={!loading ? { scale: 0.97 } : {}}
  className={`w-full mt-6 py-3 rounded-xl text-white font-medium tracking-wide transition
    ${
      loading
        ? "bg-purple-600/50 cursor-not-allowed"
        : "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-90 cursor-pointer"
    }`}
>
  {loading
    ? "Please wait..."
    : firstTime
    ? "Set Password"
    : "Login"}
</motion.button>

        </form>

        {/* Footer Login ID */}
        <div className="px-6 pb-4 flex justify-end">
          <span className="text-xs text-gray-500 italic">
            Login ID •{" "}
            <span className="text-purple-400 font-mono">
              {linkId}
            </span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
