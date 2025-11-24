"use client";
import React, { useState } from "react";

export default function AdminSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  return (
    <div className="relative w-72">
      <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder="Search..."
        className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#3A3A4E] border
                border-white/10 text-sm text-gray-200 placeholder-gray-400 
                focus:outline-none shadow-inner"
      />
    </div>
  );
}
