const Stripe = require("stripe");
const { STRIPE_SECRET_KEY } = require("../config");
const Payment = require("../models/Payment");
const Job = require("../models/Job");

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

// POST /api/payments/create-intent (client only)
// Creates a Stripe PaymentIntent for a job's budget and records a pending Payment.
async function createPaymentIntent(req, res, next) {
  try {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env." });
    }

    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the job owner can pay for this job." });
    }
    if (!job.assignedFreelancer) {
      return res.status(400).json({ message: "This job has no assigned freelancer yet." });
    }

    const amountInCents = Math.round(job.budget * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: { jobId: job._id.toString() },
      automatic_payment_methods: { enabled: true }
    });

    const payment = await Payment.create({
      job: job._id,
      client: req.user._id,
      freelancer: job.assignedFreelancer,
      amount: job.budget,
      stripePaymentIntentId: paymentIntent.id,
      status: "pending"
    });

    res.status(201).json({ clientSecret: paymentIntent.client_secret, payment });
  } catch (err) {
    next(err);
  }
}

// POST /api/payments/webhook
// Stripe calls this endpoint to confirm payment success/failure.
// Mount with express.raw({ type: "application/json" }) in server.js.
async function handleWebhook(req, res) {
  if (!stripe) return res.status(500).send("Stripe not configured.");

  let event;
  try {
    event = JSON.parse(req.body);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    await Payment.findOneAndUpdate({ stripePaymentIntentId: intent.id }, { status: "succeeded" });
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    await Payment.findOneAndUpdate({ stripePaymentIntentId: intent.id }, { status: "failed" });
  }

  res.json({ received: true });
}

// GET /api/payments/job/:jobId
async function getPaymentsForJob(req, res, next) {
  try {
    const payments = await Payment.find({ job: req.params.jobId });
    res.json(payments);
  } catch (err) {
    next(err);
  }
}

module.exports = { createPaymentIntent, handleWebhook, getPaymentsForJob };
