const express = require("express");
const { body } = require("express-validator");
const {
  createProposal,
  getProposalsForJob,
  getMyProposals,
  updateProposalStatus
} = require("../controllers/proposalController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

const proposalValidation = [
  body("jobId").notEmpty().withMessage("jobId is required."),
  body("coverLetter").trim().isLength({ min: 10 }).withMessage("Cover letter must be at least 10 characters."),
  body("bidAmount").isFloat({ gt: 0 }).withMessage("Bid amount must be a positive number.")
];

router.post("/", protect, requireRole("freelancer"), proposalValidation, createProposal);
router.get("/job/:jobId", protect, requireRole("client"), getProposalsForJob);
router.get("/mine", protect, requireRole("freelancer"), getMyProposals);
router.put("/:id/status", protect, requireRole("client"), updateProposalStatus);

module.exports = router;
