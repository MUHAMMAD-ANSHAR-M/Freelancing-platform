const { validationResult } = require("express-validator");
const Review = require("../models/Review");
const Job = require("../models/Job");
const User = require("../models/User");

// POST /api/reviews
async function createReview(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed.", errors: errors.array() });
    }

    const { jobId, revieweeId, rating, comment } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.status !== "completed") {
      return res.status(400).json({ message: "Reviews can only be left on completed jobs." });
    }

    const review = await Review.create({
      job: jobId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment
    });

    // Recalculate the reviewee's average rating
    const stats = await Review.aggregate([
      { $match: { reviewee: review.reviewee } },
      { $group: { _id: "$reviewee", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    if (stats.length) {
      await User.findByIdAndUpdate(review.reviewee, {
        ratingAverage: Math.round(stats[0].avg * 10) / 10,
        ratingCount: stats[0].count
      });
    }

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already reviewed this job." });
    }
    next(err);
  }
}

// GET /api/reviews/user/:userId
async function getReviewsForUser(req, res, next) {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "name")
      .populate("job", "title")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

module.exports = { createReview, getReviewsForUser };
