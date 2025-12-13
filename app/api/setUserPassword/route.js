import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password required" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Update user AND mark first-time password set
    const updated = await User.updateOne(
      { email },
      {
        password: hashed,
        firstTimePasswordSet: true,   // ← IMPORTANT FIX
      }
    );

    if (updated.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "User not found or password unchanged" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
