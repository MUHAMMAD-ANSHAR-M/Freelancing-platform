const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["client", "freelancer", "admin"], default: "freelancer" },
    title: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    hourlyRate: { type: Number, default: 0 },
    portfolio: [
      {
        title: String,
        description: String,
        link: String
      }
    ],
    avatarUrl: { type: String, default: "" },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);