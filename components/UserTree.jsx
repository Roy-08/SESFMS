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
const [treeData, setTreeData] = useState([]);

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
                grid grid-cols-2 items-center p-5 
                rounded-2xl shadow-lg
                bg-gradient-to-r 
                from-purple-700 via-pink-600 to-orange-500
                border border-white/20
              "
            >
              {/* NAME */}
              <span className="text-white font-semibold text-lg text-left">
                {node.name}
              </span>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3">
                {/* EDIT */}
                <button
                  onClick={() => setEditUser(node)}
                  className="p-2 rounded-full text-white bg-purple-600 cursor-pointer shadow-md"
                >
                  <FiEdit size={18} />
                </button>

                {/* DELETE */}
                <button
                  onClick={() => setDeleteId(node._id)}
                  className="p-2 rounded-full text-white bg-red-500 cursor-pointer shadow-md"
                >
                  <FiTrash2 size={18} />
                </button>

                {/* SHARE */}
                <button
                  onClick={() => setShareId(node._id)}
                  className="p-2 rounded-full bg-yellow-400 text-yellow-900 cursor-pointer shadow-md"
                >
                  <FiShare2 size={18} />
                </button>
              </div>
            </div>

            {/* SHARE DROPDOWN */}
            {shareId === node._id && (
              <div
                className="
                  absolute top-full right-0 mt-2
                  bg-white/90 backdrop-blur-md
                  rounded-xl shadow-lg
                  border border-purple-200
                  z-40 w-40
                "
              >
                <button
                  onClick={() => copyLoginLink(node)}
                  className="
                    flex items-center gap-2 px-4 py-2
                    text-sm text-purple-700
                    hover:bg-purple-100 rounded-xl
                    cursor-pointer
                  "
                >
                  <FiShare2 className="text-purple-700" />
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
