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
  const [loadingUser, setLoadingUser] = useState(true);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/getUserByLinkId?linkId=${linkId}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Invalid login link");
          setLoadingUser(false);
          return;
        }

        // If user already has password: check if client has a valid session
        if (data.firstTimePasswordSet) {
          // Ask backend if auth_token session is valid
          const authCheck = await fetch(`/api/checkAuth`, { method: "GET" });

          if (authCheck.ok) {
            // session valid -> go to user's main page
            router.push(`/login/${linkId}`);
            return;
          } else {
            // session not valid -> send user to normal login (not the reset page)
            router.push(`/login`);
            return;
          }
        }

        // otherwise show the set-password UI
        setEmail(data.email);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load user");
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId]);

  const doLogin = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Set user password
      const res = await fetch("/api/setUserPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to set password");
        setLoading(false);
        return;
      }

      toast.success("Password set successfully");

      // 2️⃣ Login user immediately (assumes /api/login will set auth_token cookie)
      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        toast.error(loginData.message || "Login failed");
        setLoading(false);
        return;
      }

      toast.success("Login successful");

      // 3️⃣ Redirect to user's main page (TreePage)
      router.push(`/login/${linkId}`);
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return <div className="text-white text-center mt-40">Loading...</div>;
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
          <Lock size={46} className="text-purple-400 drop-shadow-lg mb-2" />
          <h2 className="text-3xl font-semibold tracking-wide">Set Password</h2>

          <p className="text-gray-300 text-base sm:text-lg md:text-xl mt-2 text-center">
            Login for{" "}
            <span className="text-purple-300 font-semibold text-lg sm:text-xl md:text-2xl">
              {email}
            </span>
          </p>
        </div>

        <form onSubmit={doLogin}>
          {/* New Password */}
          <div className="mt-2">
            <label className="flex items-center gap-2 text-gray-300 mb-1">
              <span className="text-sm">New Password</span>
            </label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition"
              placeholder="••••••••"
              type="password"
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <label className="flex items-center gap-2 text-gray-300 mb-1">
              <span className="text-sm">Confirm Password</span>
            </label>
            <input
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition"
              placeholder="••••••••"
              type="password"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full mt-6 p-3 rounded-xl font-semibold shadow-lg tracking-wide text-white transition
              ${loading ? "bg-purple-500/80 cursor-wait" : "bg-purple-600 hover:bg-purple-700"}`}
          >
            {loading ? "Processing..." : "Set Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

