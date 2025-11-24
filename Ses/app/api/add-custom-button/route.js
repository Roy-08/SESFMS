import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { userId, title, url } = await req.json();

    await User.findByIdAndUpdate(userId, {
      $push: {
        customModules: { title, url }
      }
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
