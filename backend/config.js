require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/freelanceDB",
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000"
};
