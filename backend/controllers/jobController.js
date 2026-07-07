const { validationResult } = require("express-validator");
const Job = require("../models/Job");

// GET /api/jobs (supports ?category=&status=&search=)
async function getJobs(req, res, next) {
  try {
    const { category, status, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" };

    const jobs = await Job.find(filter)
      .populate("client", "name email")
      .populate("assignedFreelancer", "name email")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

// GET /api/jobs/:id
async function getJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id)
      .populate("client", "name email")
      .populate("assignedFreelancer", "name email");
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

// POST /api/jobs (clients only)
async function createJob(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed.", errors: errors.array() });
    }

    const { title, description, budget, category, skillsRequired } = req.body;
    const job = await Job.create({
      title,
      description,
      budget,
      category,
      skillsRequired,
      client: req.user._id
    });

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

// PUT /api/jobs/:id (owning client only)
async function updateJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the job owner can update this job." });
    }

    const allowedFields = ["title", "description", "budget", "category", "skillsRequired", "status", "assignedFreelancer"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/jobs/:id (owning client only)
async function deleteJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the job owner can delete this job." });
    }
    await job.deleteOne();
    res.json({ message: "Job deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
