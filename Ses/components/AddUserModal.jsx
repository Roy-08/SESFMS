"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddUserModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, employeeId, email }),
      });

      const data = await res.json();
      setSaving(false);

      if (!res.ok) {
        showCenterToast(data.error || "Failed to create user", "error");
        return;
      }

      showCenterToast("User Created Successfully!", "success");

      setTimeout(() => {
        showCenterToast(`Default Password: ${data.defaultPassword}`, "info");
      }, 700);

      onCreated?.();
      onClose?.();
    } catch (err) {
      setSaving(false);
      showCenterToast("Network Error: " + err.message, "error");
    }
  };

  // Sunset-themed toasts
  const showCenterToast = (msg, type) => {
    toast.custom(
      <div
        className={`
          px-6 py-3 rounded-xl text-white text-base font-medium shadow-xl 
          animate-toast border backdrop-blur-xl
          ${
            type === "success"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-300"
              : ""
          }
          ${
            type === "error"
              ? "bg-gradient-to-r from-red-500 to-rose-600 border-rose-400"
              : ""
          }
          ${
            type === "info"
              ? "bg-gradient-to-r from-purple-500 to-blue-500 border-purple-400"
              : ""
          }
        `}
      >
        {msg}
      </div>,
      {
        duration: 3500,
        position: "top-center",
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Sunset Glass Card */}
      <div
        className="
          w-full max-w-md p-8 rounded-2xl shadow-2xl
          bg-white/10 backdrop-blur-2xl
          border border-white/20 relative overflow-hidden
          animate-modal font-dm
        "
      >
        {/* Sunset Glow Orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="sunset-orb orb-1"></div>
          <div className="sunset-orb orb-2"></div>
          <div className="sunset-orb orb-3"></div>
        </div>

        <h2
          className="
            text-3xl font-bold mb-6 text-center
            bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-400
            text-transparent bg-clip-text drop-shadow-lg
          "
        >
          Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input */}
          <div>
            <label className="text-white/80 text-sm font-medium">Full Name</label>
            <input
              className="
                w-full mt-1 px-4 py-3 rounded-xl
                bg-white/10 backdrop-blur-xl text-white  
                placeholder:text-gray-300
                border border-white/20
                focus:border-amber-400 focus:ring-2 focus:ring-amber-300/40
                transition outline-none
              "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium">Employee ID</label>
            <input
              className="
                w-full mt-1 px-4 py-3 rounded-xl
                bg-white/10 backdrop-blur-xl text-white  
                placeholder:text-gray-300
                border border-white/20
                focus:border-orange-400 focus:ring-2 focus:ring-orange-300/40
                transition outline-none
              "
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium">Email</label>
            <input
              type="email"
              className="
                w-full mt-1 px-4 py-3 rounded-xl
                bg-white/10 backdrop-blur-xl text-white  
                placeholder:text-gray-300
                border border-white/20
                focus:border-purple-400 focus:ring-2 focus:ring-purple-300/40
                transition outline-none
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                px-5 py-2 rounded-xl text-white/80 font-medium
                bg-white/10 border border-white/20 backdrop-blur-xl
                hover:bg-white/20 transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                px-6 py-2 rounded-xl text-white font-semibold shadow-lg
                bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400
                hover:brightness-110 transition
              "
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Animations + Sunset Orbs */}
      <style>{`
        .animate-modal {
          animation: modalPop 0.25s ease-out;
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(.85); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-toast {
          animation: toastPop .25s ease-out;
        }
        @keyframes toastPop {
          0% { opacity: 0; transform: translateY(-10px) scale(.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .sunset-orb {
          position: absolute;
          width: 500px;
          height: 500px;
          filter: blur(120px);
          opacity: 0.35;
          animation: float 8s infinite alternate ease-in-out;
        }
        .orb-1 {
          top: -200px;
          left: -150px;
          background: radial-gradient(circle at 30% 30%, #ff914d, transparent 70%);
        }
        .orb-2 {
          bottom: -200px;
          right: -150px;
          background: radial-gradient(circle at 70% 70%, #ff4d6d, transparent 70%);
          animation-duration: 12s;
        }
        .orb-3 {
          top: 40%;
          left: 20%;
          background: radial-gradient(circle at 50% 50%, #f9d423, transparent 70%);
          animation-duration: 15s;
        }

        @keyframes float {
          from { transform: translateY(-20px); }
          to { transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
}
