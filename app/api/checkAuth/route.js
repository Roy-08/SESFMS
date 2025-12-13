import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "No token" }), { status: 401 });
    }

    try {
      // verify token (same secret used to sign it)
      jwt.verify(token, process.env.JWT_SECRET);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (err) {
      console.error("Invalid token:", err);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }
  } catch (err) {
    console.error("Error in checkAuth:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
