"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

export default function AdminSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  return (
    <div className="relative w-72 group">
      {/* Search Icon */}
      <Search
        size={16}
        className="
          absolute left-3.5 top-1/2 -translate-y-1/2
          text-gray-400
          transition-all duration-300
          group-focus-within:text-orange-400
          group-focus-within:scale-110
        "
      />

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder="Search..."
        className="
          w-full pl-10 pr-3 py-2 rounded-xl
          bg-[#3A3A4E]
          border border-white/10
          text-sm text-gray-200
          placeholder-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-orange-400/40
          transition-all duration-300
          shadow-inner
        "
      />
    </div>
  );
}
