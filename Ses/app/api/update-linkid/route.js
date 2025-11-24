import User from "@/models/User";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, linkId } = await req.json();
    await connectDB();

    // Update link ID
    await User.findByIdAndUpdate(id, { linkId });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
