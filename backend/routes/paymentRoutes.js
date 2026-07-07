const express = require("express");
const { createPaymentIntent, getPaymentsForJob } = require("../controllers/paymentController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Note: the Stripe webhook route (/api/payments/webhook) is registered
// separately in server.js because it needs the raw request body.
router.post("/create-intent", protect, requireRole("client"), createPaymentIntent);
router.get("/job/:jobId", protect, getPaymentsForJob);

module.exports = router;
