import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // insert test document
    await User.create({
      name: "TestUser",
      email: "test@example.com",
      password: "12345"
    });

    return NextResponse.json({ message: "Inserted into DB!" });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
