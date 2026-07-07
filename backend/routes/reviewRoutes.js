const express = require("express");
const { body } = require("express-validator");
const { createReview, getReviewsForUser } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const reviewValidation = [
  body("jobId").notEmpty().withMessage("jobId is required."),
  body("revieweeId").notEmpty().withMessage("revieweeId is required."),
  body("rating").isFloat({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5.")
];

router.post("/", protect, reviewValidation, createReview);
router.get("/user/:userId", getReviewsForUser);

module.exports = router;
