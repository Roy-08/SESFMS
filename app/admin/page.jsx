export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import React from "react";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AdminPageClient from "./AdminPageClient";

function removeDuplicateNodes(nodes) {
  const seen = new Set();
  const dedupe = (list) =>
    list
      .filter((node) => {
        if (seen.has(node._id)) return false;
        seen.add(node._id);
        return true;
      })
      .map((node) => ({
        ...node,
        children: dedupe(node.children),
      }));
  return dedupe(nodes);
}

function sanitizeUser(u) {
  return {
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    employeeId: u.employeeId,
    role: u.role,
    linkId: u.linkId,
    parentLinkId: u.parentLinkId || null,
    profileImage: u.profileImage || "",
    allowedModules: (u.allowedModules || []).map((m) => ({
      title: m.title,
      url: m.url,
      _id: m._id ? m._id.toString() : null,
    })),
    children: Array.isArray(u.children) ? u.children.map(sanitizeUser) : [],
  };
}

async function fetchUserTree() {
  await connectDB();
  let users = await User.find({}).sort({ createdAt: 1 }).lean();
  users = users.filter((u) => u.role !== "admin");

  const map = {};
  users.forEach((u) => {
    map[u.linkId] = {
      ...u,
      _id: u._id.toString(),
      children: [],
    };
  });

  const tree = [];
  users.forEach((u) => {
    if (u.parentLinkId && map[u.parentLinkId]) {
      map[u.parentLinkId].children.push(map[u.linkId]);
    } else {
      tree.push(map[u.linkId]);
    }
  });

  return removeDuplicateNodes(tree.map(sanitizeUser));
}

export default async function AdminPage() {
  const userTree = await fetchUserTree();

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100 font-dm">

      {/* TOP HEADER (LOGO) */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <img
          src="/logo2.png"
          alt="Logo"
          className="w-32 h-auto object-contain"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="h-full max-w-7xl mx-auto px-6 pt-4 pb-6 flex flex-col">

        {/* TITLE */}
        <header className="mb-6 flex justify-center shrink-0">
          <h1 className="text-5xl font-bold tracking-wide bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-transparent bg-clip-text">
            MIS Dashboard
          </h1>
        </header>

        {/* TABLE HEADER */}
        <div className="shrink-0 w-full px-6 py-4 mb-5 rounded-xl shadow-md grid grid-cols-2 font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
          <span className="text-left text-[16px]">Name</span>
          <span className="text-right text-[16px] pr-6">Actions</span>
        </div>

        {/* USER LIST — ONLY SCROLL AREA */}
        <section className="flex-1 bg-white border border-gray-200 rounded-xl p-6 shadow-lg overflow-y-auto">
          <AdminPageClient userTree={userTree} />
        </section>

      </div>
    </div>
  );
}
