"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Portal from "@/components/Portal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

/* ---------- CROP UTILS ---------- */
function getCroppedImg(image, crop) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
  });
}
/* -------------------------------- */

export default function EditUserPopup({ user, onClose, onUpdate }) {
  const [newLinkId, setNewLinkId] = useState(user.linkId || "");
  const [baseUrl, setBaseUrl] = useState("");

  const [existingLinks, setExistingLinks] = useState([]);
  const [customLinks, setCustomLinks] = useState([]);

  const [showFields, setShowFields] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(
    user.profileImage ||
      "https://res.cloudinary.com/doxm7hect/image/upload/v1763961335"
  );

  /* ---------- CROP STATES ---------- */
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({
    unit: "px",
    x: 50,
    y: 50,
    width: 200,
    height: 200,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  /* -------------------------------- */

  useEffect(() => {
    if (user.allowedModules) setExistingLinks([...user.allowedModules]);
  }, [user]);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  /* ---------- UPLOAD IMAGE ---------- */
  const uploadProfilePicture = async () => {
    if (!profileFile) return null;

    const formData = new FormData();
    formData.append("file", profileFile);
    formData.append("email", user.email);

    const res = await fetch("/api/upload-profile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) return null;
    return data.url;
  };
  /* -------------------------------- */

  const handleSave = async () => {
    try {
      toast.loading("Saving...");

      if (profileFile) {
        const profileUrl = await uploadProfilePicture();
        if (!profileUrl) throw new Error("Image upload failed");

        await fetch("/api/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            profileImage: profileUrl,
          }),
        });
      }

      await fetch("/api/update-linkid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user._id, linkId: newLinkId }),
      });

      await fetch("/api/update-allowed-modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          allowedModules: existingLinks,
        }),
      });

      if (customLinks.length > 0) {
        await fetch("/api/add-link-bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, links: customLinks }),
        });
      }

      toast.dismiss();
      toast.success("User Updated");
      onUpdate?.();
      onClose();
    } catch (err) {
      toast.dismiss();
      toast.error("Save failed");
    }
  };

  const addCustom = () => {
    if (!title || !url) return toast.error("Enter title & url");
    setCustomLinks((p) => [...p, { title, url }]);
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
        <div className="w-[95%] max-w-6xl h-[90%] rounded-3xl flex overflow-hidden bg-gradient-to-br from-[#1A1A2E]/90 via-[#2B124C]/85 to-[#F37821]/50 border border-white/10">

          {/* LEFT PANEL */}
          <div className="w-1/3 p-8 flex flex-col overflow-y-auto bg-white/5 backdrop-blur-xl border-r border-white/10">
            <h2 className="text-3xl font-bold mb-6 text-orange-300">
              User Controls
            </h2>

            <div className="flex flex-col items-center gap-3">
              <img
                src={profilePreview}
                className="w-28 h-28 rounded-full object-cover border-2 border-white/20 shadow-lg"
              />

              <input
                type="file"
                accept="image/*"
                id="profileUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setProfilePreview(URL.createObjectURL(file));
                    setProfileFile(file);
                    setShowCropper(true);
                  }
                }}
              />

              <label
                htmlFor="profileUpload"
                className="mt-2 px-4 py-2 rounded-lg cursor-pointer bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold"
              >
                Choose Image
              </label>

              <button
                onClick={() => setShowCropper(true)}
                className="mt-2 px-4 py-2 rounded-lg bg-blue-500 text-white"
              >
                Edit Image
              </button>
            </div>

            <div className="mt-6 text-gray-200 space-y-2 text-sm">
              <p><b className="text-orange-300">Name:</b> {user.name}</p>
              <p><b className="text-orange-300">Email:</b> {user.email}</p>
              <p><b className="text-orange-300">Employee ID:</b> {user.employeeId}</p>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold"
              >
                Save Changes
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-2/3 p-8 overflow-y-auto text-white flex flex-col gap-4">
            <div>
              <label className="text-lg font-semibold text-orange-300">Login URL</label>
              <input
                value={`${baseUrl}/login-link/${newLinkId}`}
                readOnly
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-gray-200 mb-4"
              />
            </div>

            <div>
              <label className="text-lg font-semibold text-orange-300">Login ID</label>
              <input
                value={newLinkId}
                onChange={(e) => setNewLinkId(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 mb-6"
              />
            </div>

            <div>
              <button
                onClick={() => setShowFields(!showFields)}
                className="px-4 py-2 bg-orange-400 text-black rounded-lg mb-2"
              >
                {showFields ? "Hide" : "Add New Button"}
              </button>

              {showFields && (
                <div className="flex flex-col gap-2 bg-white/10 p-4 rounded-xl border border-white/20 mb-4">
                  <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
                  />
                  <input
                    placeholder="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
                  />
                  <button
                    onClick={addCustom}
                    className="w-full py-2 bg-green-500 rounded-xl"
                  >
                    + Add Button
                  </button>
                </div>
              )}
            </div>

            {/* Existing buttons */}
            <div>
              {existingLinks.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-yellow-300 font-bold mb-2">Existing Buttons ({existingLinks.length})</h3>
                  {existingLinks.map((l, i) => (
                    <div key={i} className="flex justify-between p-3 mb-2 rounded-xl bg-white/10 border border-white/20">
                      <div>
                        <div className="text-yellow-300 font-semibold">{l.title}</div>
                        <div className="text-gray-300 text-sm">{l.url}</div>
                      </div>
                      <button
                        onClick={() => deleteExisting(i)}
                        className="px-3 py-1 bg-red-600 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Newly added buttons */}
            <div>
              {customLinks.length > 0 && (
                <div>
                  <h4 className="text-yellow-300 font-semibold mb-2">Added Buttons ({customLinks.length})</h4>
                  {customLinks.map((c, i) => (
                    <div key={i} className="flex justify-between p-3 mb-2 rounded-xl bg-white/10 border border-white/20">
                      <div>
                        <div className="text-orange-300">{c.title}</div>
                        <div className="text-gray-300 text-sm">{c.url}</div>
                      </div>
                      <button
                        onClick={() => deleteCustom(i)}
                        className="px-3 py-1 bg-red-600 rounded-lg"
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
      </div>

      {/* IMAGE CROP MODAL */}
      {showCropper && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center">
          <div className="bg-black p-6 rounded-xl w-[90%] max-w-lg">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
            >
              <img
                ref={imgRef}
                src={profilePreview}
                onLoad={(e) => (imgRef.current = e.currentTarget)}
              />
            </ReactCrop>

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-green-500 py-2 rounded-lg"
                onClick={async () => {
                  if (!completedCrop || !imgRef.current) return;

                  const blob = await getCroppedImg(imgRef.current, completedCrop);
                  const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
                  setProfileFile(file);
                  setProfilePreview(URL.createObjectURL(blob));
                  setShowCropper(false);
                }}
              >
                Save
              </button>

              <button
                className="flex-1 bg-red-600 py-2 rounded-lg"
                onClick={() => setShowCropper(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Portal>
  );
}
