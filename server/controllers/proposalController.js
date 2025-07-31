const Proposal = require("../models/Proposal");
const Gig = require("../models/Gig");
const notificationService = require('../services/notificationService');
const logActivity = require('../utils/logActivity');

exports.createProposalWithEscrow = async (req, res) => {
  try {
    const { gigId, userId, coverLetter, proposedBudget, deliveryTime, escrowAddress } = req.body;

    // Basic validation
    if (!gigId || !userId || !coverLetter || !proposedBudget || !deliveryTime || !escrowAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Create proposal
    const proposal = await Proposal.create({
      user: userId,
      gig: gigId,
      message: coverLetter,
      budget: proposedBudget,
      deliveryTime,
      escrowAddress,
      status: "Pending",
    });
await logActivity({
  userId: gig.createdBy.toString(),
  actionTitle: "New proposal received",
  context: gig.title,
  status: "pending"
});
    // Ensure gig.proposals is an array
    if (!Array.isArray(gig.proposals)) {
      gig.proposals = [];
    }

    gig.proposals.push(proposal._id);
    await gig.save();

    await notificationService.createAndSendNotification({
      userId: gig.createdBy.toString(),
      type: 'gig',
      title: 'New Proposal Received',
      message: `You received a new proposal for your gig '${gig.title}'.`,
      sourceId: gig._id,
      actionUrl: `/gig/${gig._id}`
    });
    // Notify proposal creator (for demo)
    await notificationService.createAndSendNotification({
      userId: userId,
      type: 'gig',
      title: 'Proposal Submitted',
      message: `Your proposal for gig '${gig.title}' has been submitted.`,
      sourceId: gig._id,
      actionUrl: `/gig/${gig._id}`
    });

    return res.status(201).json(proposal);
  } catch (err) {
    console.error("❌ Error creating proposal with escrow:", err);
    return res.status(500).json({ message: "Failed to create proposal with escrow" });
  }
};