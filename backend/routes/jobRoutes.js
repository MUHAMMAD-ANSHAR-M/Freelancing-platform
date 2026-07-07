const express = require("express");
const { body } = require("express-validator");
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require("../controllers/jobController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

const jobValidation = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("description").trim().isLength({ min: 20 }).withMessage("Description must be at least 20 characters."),
  body("budget").isFloat({ gt: 0 }).withMessage("Budget must be a positive number."),
  body("category").trim().notEmpty().withMessage("Category is required.")
];

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, requireRole("client"), jobValidation, createJob);
router.put("/:id", protect, requireRole("client"), updateJob);
router.delete("/:id", protect, requireRole("client"), deleteJob);

module.exports = router;
