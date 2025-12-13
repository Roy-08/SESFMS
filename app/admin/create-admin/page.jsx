"use client";

export default function CreateAdminPage() {
  const handleCreate = async () => {
    try {
      const res = await fetch("/admin/admin-api/create-admin"); // points to API
      const data = await res.json();
      alert(data.message || data.error);
    } catch (err) {
      alert("Failed to create admin: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1>Create Admin</h1>
      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Create Admin
      </button>
    </div>
  );
}
