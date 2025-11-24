"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/verify")
      .then(res => res.json())
      .then(data => {
        if (!data.loggedIn) router.push("/login");
        else setUser(data.user);
      });
  }, []);

  if (!user) return <p className="text-center mt-20 text-xl">Loading...</p>;

  const modules = [
    { name: "Leave Application FMS", key: "LEAVE" },
    { name: "SCT FMS", key: "SCT" },
    { name: "PRS FMS", key: "PRS" },
  ];

  function enterModule(m) {
    if (user.allowedModules.includes(m.key)) {
      router.push(`/module/${m.key}`);
    } else {
      alert("You are not authorized for this module");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold">Welcome, {user.id}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {modules.map((m) => (
          <div
            key={m.key}
            onClick={() => enterModule(m)}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer text-center"
          >
            <p className="text-xl font-semibold">{m.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
