import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const { email, links } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  // INSERT links into allowedModules
  user.allowedModules.push(...links);

  await user.save();

  return NextResponse.json(
    { message: "Links saved successfully!", user },
    { status: 200 }
  );
}
