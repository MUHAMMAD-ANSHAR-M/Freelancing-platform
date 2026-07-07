const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    readAt: { type: Date, default: null }
  },
  { timestamps: true }
);

messageSchema.index({ job: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
