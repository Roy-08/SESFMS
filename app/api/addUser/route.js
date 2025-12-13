// app/api/addUser/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { name, employeeId, email } = await req.json();

    if (!name || !employeeId || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const defaultPassword = `${employeeId}@401`;
    const hashed = await bcrypt.hash(defaultPassword, 10);

    const newUser = await User.create({
      name,
      employeeId,
      email,
      password: hashed,
      linkId: Math.random().toString(36).slice(2, 10),
    });

    return NextResponse.json({
      message: "User created",
      defaultPassword,
      userId: newUser._id,
    });

  } catch (err) {
    console.error("ADD USER API ERROR:", err);  // <-- HERE

    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate email or linkId" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
