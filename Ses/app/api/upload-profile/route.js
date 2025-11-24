// app/api/upload-profile/route.js
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: "profile_pictures", public_id: uuidv4() },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Return secure_url
    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (error) {
    console.error("upload-profile error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
