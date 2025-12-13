import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "Invalid email" }, { status: 400 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ message: "Invalid password" }, { status: 400 });

    // create token
    const token = jwt.sign(
      { id: user._id, email: user.email, linkId: user.linkId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // determine redirect based on role
    const redirectUrl = user.role === "admin" ? "/admin" : `/tree/${user.linkId}`;

    // set cookie
    const res = NextResponse.json({
      message: "Logged in",
      redirect: redirectUrl
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      path: "/"
    });

    return res;

  } catch (e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
