import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" }); // ← explicit path

console.log("MONGO_URL:", process.env.MONGO_URL); // should print your URI

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));
