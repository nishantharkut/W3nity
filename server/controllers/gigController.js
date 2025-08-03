const Gig = require("../models/Gig");
const mongoose = require("mongoose");
const notificationService = require('../services/notificationService');
const User = require('../models/User');

exports.createGig = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: User not found" });

    const gig = new Gig({
      ...req.body,
      createdBy: userId, // ✅ Set from token
    });
    console.log(gig)

    await gig.save();

    // Notify all users (for demo; in production, filter by category/followers)
    const users = await User.find();
    await Promise.all(users.map(user => notificationService.createAndSendNotification({
      userId: new mongoose.Types.ObjectId(user._id),
      type: 'gig',
      title: 'New Gig Posted',
      message: `A new gig "${gig.title}" has been posted!`,
      sourceId: gig._id,
      actionUrl: `/gig/${gig._id}`
    })));

    return res.status(201).json(gig);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


exports.getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().populate(
      "createdBy",
      "username avatar isVerified rating reviewCount"
    );
    return res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGigById = async (req, res) => {
  const gigId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(gigId)) {
    return res.status(400).json({ message: "Invalid Gig ID format" });
  }

  try {
    const gig = await Gig.findById(gigId).populate(
      "createdBy",
      "username avatar isVerified rating reviewCount"
    );

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const response = {
      ...gig._doc,
      client: gig.createdBy, 
      proposalCount: gig.proposals?.length || 0,
      duration: calculateDuration(gig.deadline),
    };

    console.log("✅ Gig fetched:", response);

    res.status(200).json(response);
  } catch (err) {
    console.error("❌ Error fetching gig:", err);
    res.status(500).json({ message: "Server error" });
  }
};

function calculateDuration(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24)); // in days
  return diff > 0 ? `${diff} day(s)` : "Deadline passed";
}

exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(gig);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteGig = async (req, res) => {
  try {
    await Gig.findByIdAndDelete(req.params.id);
    res.json({ message: "Gig deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
