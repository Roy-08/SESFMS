"use client";
import React, { useState } from "react";

export default function AddModuleForm() {
  const [moduleName, setModuleName] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!moduleName) return;

    try {
      const res = await fetch("/admin/api/add-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleName }),
      });
      const data = await res.json();
      alert(data.message || data.error);
      setModuleName("");
    } catch (err) {
      alert("Failed to add module: " + err.message);
    }
  };

  return (
    <form onSubmit={handleAdd} className="flex gap-2">
      <input
        type="text"
        value={moduleName}
        onChange={(e) => setModuleName(e.target.value)}
        placeholder="Module Name"
        className="p-2 rounded bg-gray-800 border border-gray-600 flex-1"
      />
      <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
        Add
      </button>
    </form>
  );
}
