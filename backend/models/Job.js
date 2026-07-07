const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true, min: 1 },
    category: { type: String, required: true },
    skillsRequired: [{ type: String }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open"
    }
  },
  { timestamps: true }
);

jobSchema.index({ status: 1, category: 1 });

module.exports = mongoose.model("Job", jobSchema);
