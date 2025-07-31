const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// @route   GET /api/dashboard/:userId
// @desc    Get user dashboard stats
router.get("/:userId",dashboardController.getUserDashboard);

module.exports = router;
