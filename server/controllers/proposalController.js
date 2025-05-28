// controllers/proposalController.js
const Proposal = require("../models/Proposal");
const Gig = require("../models/Gig");

exports.createProposalWithEscrow = async (req, res) => {
  try {
    const { gigId, userId, coverLetter, proposedBudget, deliveryTime, escrowAddress } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const proposal = await Proposal.create({
      user: userId,
      gig: gigId,
      message: coverLetter,
      budget: proposedBudget,
      deliveryTime,
      escrowAddress,
      status: "Pending",
    });

    gig.proposals.push(proposal._id);
    await gig.save();

    res.status(201).json(proposal);
  } catch (err) {
    console.error("Error creating proposal with escrow:", err);
    res.status(500).json({ message: "Failed to create proposal with escrow" });
  }
};
