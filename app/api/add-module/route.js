import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, moduleName } = await req.json();

    if (!email || !moduleName) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // PUSH INTO allowedModules
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $addToSet: { allowedModules: moduleName } }, // prevents duplicates
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Module added successfully",
      user: updatedUser,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
