"use client";

import { useEffect, useState } from "react";
import AdminAuth from "./AdminAuth";
import UserTree from "@/components/UserTree";
import AddUserButton from "@/components/AddUserButton";

export default function AdminPageClient({ userTree }) {
  const [tree, setTree] = useState(userTree);
  const [search, setSearch] = useState("");

  // 🔥 Fetch fresh users from API
  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/getUsers", {
        cache: "no-store",
      });

      const data = await res.json();
      if (data.userTree) setTree(data.userTree);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  // Load fresh users once page loads
  useEffect(() => {
    refreshUsers();
  }, []);

  // Pass refresh function to Add/Delete components later
  useEffect(() => {
    window.refreshUsers = refreshUsers;
  }, []);

  // 🔍 Filter recursively
  const filterTree = (nodes, q) => {
    if (!q) return nodes;
    const query = q.toLowerCase();

    return nodes
      .map((node) => {
        const match =
          node.name?.toLowerCase().includes(query) ||
          node.email?.toLowerCase().includes(query) ||
          node.employeeId?.toLowerCase().includes(query);

        const filteredChildren = filterTree(node.children || [], q);

        if (match || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredTree = filterTree(tree, search);

  return (
    <>
      {/* SEARCH + ADD */}
      <div className="flex items-center justify-between mb-8">
        {/* SEARCH BAR */}
        <div className="relative w-80">
          <span className="absolute left-4 top-2.5 text-black-300 text-lg opacity-80">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-12 pr-4 py-3 rounded-2xl text-sm font-medium
              bg-white/10 backdrop-blur-xl
              border border-white/20
              text-white placeholder-gray-300
              focus:ring-2 focus:ring-orange-300/70 focus:border-transparent
              transition-all duration-300
              shadow-lg shadow-black/20
            "
          />
        </div>

        {/* ADD BUTTON */}
        <AddUserButton />
      </div>

      {/* RENDER FILTERED USERS */}
      <AdminAuth>
        <div
          className="
            rounded-2xl p-6
            bg-white/5 backdrop-blur-xl 
            border border-white/10
            shadow-xl shadow-black/30
          "
        >
          <UserTree data={filteredTree} />
        </div>
      </AdminAuth>
    </>
  );
}
