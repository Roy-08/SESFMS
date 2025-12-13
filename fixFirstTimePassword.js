// fixFirstTimePassword.js
import connectDB from "./lib/db.js";
import User from "./models/User.js";

async function fixUsers() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Update all users missing the field
    const result = await User.updateMany(
      { firstTimePasswordSet: { $exists: false } },
      { $set: { firstTimePasswordSet: false } }
    );

    console.log("Users updated:", result.modifiedCount);

    // Verify all users now have the field
    const check = await User.find({}).select("name firstTimePasswordSet").lean();
    console.log("Sample users after update:", check.slice(0, 5));

    process.exit(0);
  } catch (err) {
    console.error("Error fixing users:", err);
    process.exit(1);
  }
}

fixUsers();
