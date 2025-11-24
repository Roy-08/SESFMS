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

    /** ✅ ADDED THIS — IMPORTANT */
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
    <div
      className="
        h-screen w-full flex items-center justify-center text-white
        bg-[url('/sunset.png')] bg-cover bg-center bg-no-repeat bg-fixed
        px-4 font-dm overflow-hidden
      "
    >
      
      <div
        className="
          w-full max-w-4xl mx-auto
          p-8 rounded-3xl shadow-2xl
          bg-white/40 backdrop-blur-xl
          border border-white/10
        "
      >
        <img
        src="/logo2.png"
        alt="Logo"
        className="absolute top-0 left-3 w-43 h-43 object-contain "
      />
        <header className="mb-14 flex justify-center">
          <h1
            className="
              text-4xl font-bold tracking-wide relative font-dm
              bg-gradient-to-r from-[red] via-[orange] to-[red]
              text-transparent bg-clip-text
              animate-fireGlow
            "
          >
            Admin Dashboard
          </h1>
        </header>

        <div
          className="
            w-full px-5 py-4 mb-8 rounded-xl shadow-md
            grid grid-cols-2 font-semibold text-white
            bg-gradient-to-r from-[orange] via-[#A45A32] to-[#F9B35E]
          "
        >
          <span className="text-left pl-7 text-[16px]">Name</span>
          <span className="text-right pr-12 text-[16px]">Actions</span>
        </div>

        <section
          className="
            bg-[black]/10 border border-white/10
            rounded-xl p-6 shadow-xl
            max-h-[60vh] overflow-y-auto
          "
        >
          <AdminPageClient userTree={userTree} />
        </section>
      </div>
    </div>
  );
}
