"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Portal from "@/components/Portal";

export default function EditUserPopup({ user, onClose }) {
  const [newLinkId, setNewLinkId] = useState(user.linkId || "");
  const [baseUrl, setBaseUrl] = useState("");

  const [existingLinks, setExistingLinks] = useState([]);
  const [customLinks, setCustomLinks] = useState([]);

  const [showFields, setShowFields] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Profile Image States
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(user.profileImage || "https://res.cloudinary.com/doxm7hect/image/upload/v1763961335");

  useEffect(() => {
    if (user.allowedModules) {
      setExistingLinks([...user.allowedModules]);
    }
  }, [user]);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  // Upload Profile Picture to Cloudinary
  const uploadProfilePicture = async () => {
    if (!profileFile) return null;

    try {
      const formData = new FormData();
      formData.append("file", profileFile);
      formData.append("email", user.email);

      const res = await fetch("/api/upload-profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Upload failed", data);
        toast.error("Upload failed");
        return null;
      }

      return data.url;
    } catch (err) {
      console.error("Upload exception", err);
      toast.error("Upload failed");
      return null;
    }
  };

  const handleSave = async () => {
  try {
    let profileUrl = null;

    // Upload if new image selected
    if (profileFile) {
      toast.loading("Uploading image...");
      profileUrl = await uploadProfilePicture();
      toast.dismiss();
      if (!profileUrl) return;
    }

    // Save profile image
    if (profileUrl) {
      const upd = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, profileImage: profileUrl }),
      });

      if (!upd.ok) {
        toast.error("Failed saving profile image");
        return;
      }

      setProfilePreview(profileUrl);
      user.profileImage = profileUrl;
    }

    // Save link id
    await fetch("/api/update-linkid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user._id, linkId: newLinkId }),
    });

    // Save allowed modules
    await fetch("/api/update-allowed-modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, allowedModules: existingLinks }),
    });

    if (customLinks.length > 0) {
      await fetch("/api/add-link-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, links: customLinks }),
      });
    }

    // -------------- 🔥 IMPORTANT PART --------------
    toast.success("User updated");

    if (typeof onUpdate === "function") {
      onUpdate();   // Refresh UserTree in parent
    }

    onClose();       // Close popup
    // -----------------------------------------------

  } catch (err) {
    console.error(err);
    toast.error("Save failed");
  }
};



  const addCustom = () => {
    if (!title || !url) return toast.error("Enter title & url");
    setCustomLinks((prev) => [...prev, { title, url }]);
    toast.success("Button Added!");
    setTitle("");
    setUrl("");
  };

  const deleteExisting = (i) => {
    setExistingLinks(existingLinks.filter((_, idx) => idx !== i));
  };

  const deleteCustom = (i) => {
    setCustomLinks(customLinks.filter((_, idx) => idx !== i));
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
        <div className="w-[95%] max-w-6xl h-[90%] rounded-3xl overflow-hidden shadow-2xl flex bg-gradient-to-br from-[#1A1A2E]/90 via-[#2B124C]/85 to-[#F37821]/50 border border-white/10">

          {/* LEFT PANEL — scrollable to ensure access to buttons on small screens */}
          <div className="w-1/3 p-8 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col overflow-y-auto">
            <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-orange-400 to-yellow-300 text-transparent bg-clip-text">
              User Controls
            </h2>

            {/* PROFILE UPLOAD */}
            <div className="mt-3 flex flex-col items-center">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-white/20 shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                id="profileUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setProfileFile(file);
                    setProfilePreview(URL.createObjectURL(file));
                  }
                }}
              />

              <label
                htmlFor="profileUpload"
                className="mt-4 px-4 py-2 rounded-lg cursor-pointer 
                  bg-gradient-to-r from-orange-500 to-yellow-400 
                  text-black font-semibold shadow-md hover:opacity-90"
              >
                Choose Profile Picture
              </label>

              {profileFile && (
                <p className="text-sm mt-2 text-gray-300">
                  Selected: {profileFile.name}
                </p>
              )}
            </div>

            <div className="space-y-4 text-gray-200 text-lg mt-6">
              <p><b className="text-orange-300">Name:</b> {user.name}</p>
              <p><b className="text-orange-300">Email:</b> {user.email}</p>
              <p><b className="text-orange-300">Employee ID:</b> {user.employeeId}</p>
            </div>

            {/* BUTTONS */}
            <div className="mt-auto pt-10 space-y-3">
              <button
                onClick={handleSave}
                className="w-full py-3 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 transition"
              >
                Save Changes
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-2/3 p-8 overflow-y-auto text-white">
            <label className="text-lg font-semibold text-orange-300">Login URL</label>
            <input
              value={`${baseUrl}/login-link/${newLinkId}`}
              readOnly
              className="w-full p-3 mb-6 rounded-xl bg-white/10 border border-white/20 text-gray-200"
            />

            <label className="text-lg font-semibold text-orange-300">Login ID</label>
            <input
              value={newLinkId}
              onChange={(e) => setNewLinkId(e.target.value)}
              className="w-full p-3 mb-6 rounded-xl bg-white/10 border border-white/20 text-gray-200"
            />

            <h3 className="text-2xl font-bold text-yellow-300 mb-3">
              Existing Buttons ({existingLinks.length})
            </h3>

            {existingLinks.length === 0 ? (
              <p className="text-gray-400 mb-4">No buttons yet.</p>
            ) : (
              existingLinks.map((l, i) => (
                <div key={i} className="bg-white/10 border border-white/10 p-4 rounded-xl mb-3 flex justify-between items-center">
                  <div>
                    <div className="text-yellow-300 font-semibold">{l.title}</div>
                    <div className="text-gray-300 text-sm">{l.url}</div>
                  </div>

                  <button
                    onClick={() => deleteExisting(i)}
                    className="px-4 py-1 rounded-lg bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}

            <button
              onClick={() => setShowFields(!showFields)}
              className="px-4 py-2 mb-4 mt-2 rounded-lg shadow-md bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold"
            >
              {showFields ? "Hide" : "Add New Button"}
            </button>

            {showFields && (
              <div className="p-4 mb-4 rounded-xl bg-white/10 border border-white/20">
                <input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 mb-3 rounded-xl bg-white/10 border border-white/20"
                />

                <input
                  placeholder="URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-3 mb-3 rounded-xl bg-white/10 border border-white/20"
                />

                <button
                  type="button"
                  onClick={addCustom}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-xl font-bold"
                >
                  + Add Button
                </button>
              </div>
            )}

            {customLinks.length > 0 && (
              <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                <h4 className="text-yellow-300 font-semibold mb-3">
                  Added Buttons ({customLinks.length})
                </h4>

                {customLinks.map((c, i) => (
                  <div key={i} className="flex justify-between p-3 mb-2 rounded-xl bg-white/10 border border-white/10">
                    <div>
                      <div className="text-orange-300">{c.title}</div>
                      <div className="text-gray-300 text-sm">{c.url}</div>
                    </div>

                    <button
                      onClick={() => deleteCustom(i)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </Portal>
  );
}
