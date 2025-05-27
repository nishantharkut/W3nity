// controllers/proposalController.js
const Proposal = require("../models/Proposal");
const Gig = require("../models/Gig");

exports.submitProposal = async (req, res) => {
  try {
    const { userId, message, budget } = req.body;
    const gigId = req.params.id;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const proposal = await Proposal.create({
      user: userId,
      gig: gigId,
      message,
      budget,
    });

    gig.proposals.push(proposal._id);
    await gig.save();

    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ message: "Error submitting proposal" });
  }
};
