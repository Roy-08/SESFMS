import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  email: { type: String, required: true },
  name: String,
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },

  profileImage: { type: String, default: "" },   // 🔥 NEW FIELD

  allowedModules: [
    {
      title: String,
      url: String,
    }
  ],

  customModules: [
    {
      title: String,
      url: String,
    }
  ],

  linkId: { type: String, unique: true, sparse: true },
  links: { type: [LinkSchema], default: [] },
  firstTimePasswordSet: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
