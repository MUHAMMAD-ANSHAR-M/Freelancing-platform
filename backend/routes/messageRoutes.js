const express = require("express");
const { body } = require("express-validator");
const { sendMessage, getMessagesForJob, markAsRead } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const messageValidation = [
  body("jobId").notEmpty().withMessage("jobId is required."),
  body("recipientId").notEmpty().withMessage("recipientId is required."),
  body("content").trim().notEmpty().withMessage("Message content cannot be empty.")
];

router.post("/", protect, messageValidation, sendMessage);
router.get("/job/:jobId", protect, getMessagesForJob);
router.put("/:id/read", protect, markAsRead);

module.exports = router;
