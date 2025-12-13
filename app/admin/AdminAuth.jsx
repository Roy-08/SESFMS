"use client";
import React, { useEffect, useState } from "react";

export default function AdminAuth({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    fetch("/api/verify-admin")
      .then((res) => res.json())
      .then((data) => setAuthorized(data.authorized))
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null)
    return (
      <div className="min-h-[200px] flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (!authorized)
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center text-red-500">
        ❌ Unauthorized — Please login as admin
        <a
          href="/login"
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
        >
          Go to Login
        </a>
      </div>
    );

  return <>{children}</>;
}
  