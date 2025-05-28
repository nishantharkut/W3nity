const express = require("express");
const router = express.Router();
const gigController = require("../controllers/gigController");
const authMiddleware= require("../middlewares/authMiddleware")
const { submitProposal, createProposalWithEscrow } = require("../controllers/proposalController");

router.post("/",authMiddleware, gigController.createGig);
router.get("/", gigController.getAllGigs);
router.get("/:id", gigController.getGigById);
router.put("/:id", gigController.updateGig);
router.delete("/:id", gigController.deleteGig);

//after web3
router.post("/:id/proposals", createProposalWithEscrow);


module.exports = router;