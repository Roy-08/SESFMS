"use client";
import { motion } from "framer-motion";
import { FiTrash2, FiX } from "react-icons/fi";

export default function DeleteConfirmPopup({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1d1d27] text-white w-80 p-6 rounded-2xl shadow-2xl border border-white/10"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Delete User?</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <FiX size={22} />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-300 text-sm mb-6">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 flex items-center gap-2 text-sm"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
