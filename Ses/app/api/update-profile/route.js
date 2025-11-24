// app/api/update-profile/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, profileImage } = await req.json();

    if (!email || !profileImage) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const updated = await User.findOneAndUpdate(
      { email },
      { profileImage },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("update-profile error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
