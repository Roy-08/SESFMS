import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, title, url } = await req.json();

    if (!email || !title || !url) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $push: {
  links: { title, url },
},

      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Module added", user: updatedUser });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
