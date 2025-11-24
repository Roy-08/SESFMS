"use client";

import { FiEdit, FiTrash2, FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useState } from "react";
import EditUserPopup from "./EditUserPopup";
import DeleteConfirmPopup from "./DeleteConfirmPopup";

export default function UserTree({ data }) {
  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [shareId, setShareId] = useState(null);

  const refreshData = async () => {
    const res = await fetch("/api/getUsers");
    const json = await res.json();
    setTreeData(json.userTree);
  };

  const confirmDelete = async () => {
    const res = await fetch("/api/deleteUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: deleteId }),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.error || "Failed");
      return;
    }

    toast.success("User deleted");
    window.location.reload();
  };

  const copyLoginLink = (user) => {
    const loginUrl = `${window.location.origin}/login-link/${user.linkId}`;
    navigator.clipboard.writeText(loginUrl);
    toast.success("Login URL Copied!");
    setShareId(null);
  };

  const renderTree = (nodes) => (
    <ul className="ml-2">
      {nodes.map((node) => (
        <li key={node._id} className="my-4">
          <div className="relative">

            {/* USER CARD */}
            <div
              className="
                grid grid-cols-2 items-center p-4 
                rounded-xl shadow-lg
                bg-gradient-to-r 
                from-[#0E1744] via-[#3A2F7A] to-[#F29C52]
                border border-white/20
              "
            >
              {/* NAME */}
              <span className="text-white font-semibold text-lg text-left">
                {node.name}
              </span>

              {/* BUTTONS */}
              <div className="flex justify-end gap-2">

                {/* EDIT */}
                <button
                  onClick={() => setEditUser(node)}
                  className="p-2 rounded-full text-white 
                             bg-[#6B4CFF] hover:bg-[#7C60FF]"
                >
                  <FiEdit />
                </button>

                {/* DELETE */}
                <button
                  onClick={() => setDeleteId(node._id)}
                  className="p-2 rounded-full text-white
                             bg-[#FF4B4B] hover:bg-[#FF2E2E]"
                >
                  <FiTrash2 />
                </button>

                {/* SHARE */}
                <button
                  onClick={() => setShareId(node._id)}
                  className="p-2 rounded-full 
                             bg-[#FFD047] text-[#4A2A00] 
                             hover:bg-[#FFE07A]"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>

            {/* SHARE DROPDOWN */}
            {shareId === node._id && (
              <div
                className="
                  absolute top-full right-0 mt-1 
                  bg-white/80 backdrop-blur-md 
                  rounded-xl shadow-xl 
                  border border-[#D7C2FF]/40
                  z-40 w-36
                "
              >
                <button
                  onClick={() => copyLoginLink(node)}
                  className="
                    flex items-center gap-2 px-3 py-2 
                    text-sm text-[#4A2A7A]
                    hover:bg-[#EEE2FF] rounded-xl
                  "
                >
                  <FiShare2 className="text-[#4A2A7A] text-base" />
                  Copy Link
                </button>
              </div>
            )}

          </div>

          {/* CHILDREN */}
          {node.children?.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      {renderTree(data)}

      {editUser && (
        <EditUserPopup
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdate={refreshData}
        />
      )}

      {deleteId && (
        <DeleteConfirmPopup
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
