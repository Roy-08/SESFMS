import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get("linkId");

    if (!linkId) {
      return new Response(JSON.stringify({ error: "linkId is required" }), {
        status: 400,
      });
    }

    const user = await User.findOne({ linkId }).lean();

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        email: user.email,
        firstTimePasswordSet: user.firstTimePasswordSet || false,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
