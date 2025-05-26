const Gig = require("../models/Gig");

exports.createGig = async (req, res) => {
  try {
    const gig = new Gig(req.body);
    await gig.save();
    return res.status(201).json(gig);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().populate("createdBy", "username avatar isVerified rating reviewCount");
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("createdBy");
    return res.json(gig);
  } catch (err) {
    return res.status(404).json({ error: "Gig not found" });
  }
};

exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
