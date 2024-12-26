// src/routes/index.js

const express = require("express");
const router = express.Router();

// Import sub-route files
const analyticsRoutes = require("./analytics.routes");
const authRoutes = require("./auth.routes");
const campaignRoutes = require("./campaign.routes");
const companyRoutes = require("./company.routes");
const contentRoutes = require("./content.routes");
const integrationRoutes = require("./integration.routes");
const newsRoutes = require("./news.routes");
const userRoutes = require("./user.routes");

// DEBUG LOGS:
console.log("analyticsRoutes:", analyticsRoutes);
console.log("authRoutes:", authRoutes);
console.log("campaignRoutes:", campaignRoutes);
console.log("companyRoutes:", companyRoutes);
console.log("contentRoutes:", contentRoutes);
console.log("integrationRoutes:", integrationRoutes);
console.log("newsRoutes:", newsRoutes);
console.log("userRoutes:", userRoutes);

// Now mount each route with a path prefix
router.use("/analytics", analyticsRoutes);
router.use("/auth", authRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/companies", companyRoutes);
router.use("/content", contentRoutes);
router.use("/integrations", integrationRoutes);
router.use("/news", newsRoutes);
router.use("/users", userRoutes);

// Example: a simple test route to confirm the index router is working
router.get("/ping", (req, res) => {
  res.json({ success: true, message: "pong from index.js routes" });
});

module.exports = router;
