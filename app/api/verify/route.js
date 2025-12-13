import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ 
      loggedIn: true,
      redirect: `/tree/${decoded.linkId}` 
    });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
