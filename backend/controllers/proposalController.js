const { validationResult } = require("express-validator");
const Proposal = require("../models/Proposal");
const Job = require("../models/Job");

// POST /api/proposals (freelancers only)
async function createProposal(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed.", errors: errors.array() });
    }

    const { jobId, coverLetter, bidAmount, estimatedDays } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.status !== "open") {
      return res.status(400).json({ message: "This job is no longer accepting proposals." });
    }

    const proposal = await Proposal.create({
      job: jobId,
      freelancer: req.user._id,
      coverLetter,
      bidAmount,
      estimatedDays
    });

    res.status(201).json(proposal);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already submitted a proposal for this job." });
    }
    next(err);
  }
}

// GET /api/proposals/job/:jobId (job owner only)
async function getProposalsForJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the job owner can view proposals." });
    }

    const proposals = await Proposal.find({ job: req.params.jobId }).populate(
      "freelancer",
      "name email skills hourlyRate ratingAverage"
    );
    res.json(proposals);
  } catch (err) {
    next(err);
  }
}

// GET /api/proposals/mine (freelancer's own proposals)
async function getMyProposals(req, res, next) {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id }).populate("job", "title budget status");
    res.json(proposals);
  } catch (err) {
    next(err);
  }
}

// PUT /api/proposals/:id/status (job owner accepts/rejects)
async function updateProposalStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'accepted' or 'rejected'." });
    }

    const proposal = await Proposal.findById(req.params.id).populate("job");
    if (!proposal) return res.status(404).json({ message: "Proposal not found." });
    if (proposal.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the job owner can update this proposal." });
    }

    proposal.status = status;
    await proposal.save();

    if (status === "accepted") {
      proposal.job.status = "in-progress";
      proposal.job.assignedFreelancer = proposal.freelancer;
      await proposal.job.save();
    }

    res.json(proposal);
  } catch (err) {
    next(err);
  }
}

module.exports = { createProposal, getProposalsForJob, getMyProposals, updateProposalStatus };
