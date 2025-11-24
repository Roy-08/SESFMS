"use client";
import React, { useState } from "react";

export default function AssignButton({ name }) {
  const handleClick = () => {
    alert(`Assign Steps clicked for ${name}`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
    >
      Assign Steps
    </button>
  );
}
