// components/AddUserButton.jsx
"use client";
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import AddUserModal from "./AddUserModal";

export default function AddUserButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 font-bold text-gray-900 shadow"
      >
        <FiUserPlus />
        <span>Add User</span>
      </button>

      {open && (
        <AddUserModal
          onClose={() => setOpen(false)}
          onCreated={() => {
            // refresh page or trigger a fetch in parent
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
