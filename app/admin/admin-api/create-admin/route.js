import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    // Check if admin already exists
    const exists = await User.findOne({ email: "mis@saraswateng.com" });
    if (exists) {
      return NextResponse.json({ message: "Admin already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash("saraswat401", 10);

    
    await User.create({
      employeeId: "EMP002",
      email: "mis@saraswateng.com",
      name: "Admin",
      password: hashed,
      role: "admin",   // admin role
         // admin does not need linkId
    });

    return NextResponse.json({ message: "Admin Created Successfully!" });

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
