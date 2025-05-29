const express = require("express");
const Ticket = require("../models/ticket");
const router = express.Router();

router.get("/:walletAddress", async (req, res) => {
  const tickets = await Ticket.find({ walletAddress: req.params.walletAddress });
  res.json(tickets);
});

module.exports = router;

router.get("/event/:eventId", async (req, res) => {
  try {
    const tickets = await Ticket.find({ eventId: req.params.eventId });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event tickets" });
  }
});
