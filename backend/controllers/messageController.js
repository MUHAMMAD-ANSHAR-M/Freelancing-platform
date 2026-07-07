const { validationResult } = require("express-validator");
const Message = require("../models/Message");
const Job = require("../models/Job");

// POST /api/messages
async function sendMessage(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed.", errors: errors.array() });
    }

    const { jobId, recipientId, content } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });

    const isParticipant =
      job.client.toString() === req.user._id.toString() ||
      job.assignedFreelancer?.toString() === req.user._id.toString();
    if (!isParticipant) {
      return res.status(403).json({ message: "You are not part of this job's conversation." });
    }

    const message = await Message.create({
      job: jobId,
      sender: req.user._id,
      recipient: recipientId,
      content
    });

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

// GET /api/messages/job/:jobId
async function getMessagesForJob(req, res, next) {
  try {
    const messages = await Message.find({
      job: req.params.jobId,
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    })
      .populate("sender", "name")
      .populate("recipient", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
}

// PUT /api/messages/:id/read
async function markAsRead(req, res, next) {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found." });
    if (message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the recipient can mark this as read." });
    }
    message.readAt = new Date();
    await message.save();
    res.json(message);
  } catch (err) {
    next(err);
  }
}

module.exports = { sendMessage, getMessagesForJob, markAsRead };
