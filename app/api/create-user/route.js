import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    const exists = await User.findOne({ email: "admin@gmail.com" });
    if (exists) {
      return NextResponse.json({ message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      employeeId: "EMP002",
      email: "ad@gmail.com",
      name: "Admin User",
      password: hashed,
      allowedModules: [
        "Leave Application",
        "SCT FMS",
        "SCT FMS Data Sheet",
        "PRS FMS Data Sheet",
        "Purchase Indent FMS Data Sheet",
        "Internal Goods Transfer FMS",
        "Internal Goods Transfer Data Sheet",
        "SES Expenses Bill Input Form",
        "SES Expense Bill Submition Data Sheet",
        "Delegation"
      ],
      role: "USER",
      linkId: "admin-001" 
    });

    return NextResponse.json({ message: "Admin Created Successfully!" });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
