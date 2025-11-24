import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const { email, allowedModules } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  user.allowedModules = allowedModules;

  await user.save();

  return NextResponse.json({ message: "Modules updated", user });
}
