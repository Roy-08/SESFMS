import connectDB from "./lib/db.js";
import "dotenv/config";
connectDB()
  .then(() => console.log("DB connected successfully"))
  .catch(err => console.error("DB connection failed:", err));
