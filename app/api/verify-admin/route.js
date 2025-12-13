// /app/api/verify-admin/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const cookie = req.cookies.get("auth_token")?.value;
    if (!cookie) return NextResponse.json({ authorized: false });

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return NextResponse.json({ authorized: false });

    return NextResponse.json({ authorized: true, name: decoded.name });
  } catch {
    return NextResponse.json({ authorized: false });
  }
}
