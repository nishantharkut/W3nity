const express = require("express");
const router = express.Router();
const proposalController = require("../controllers/proposalController");

router.post("/", proposalController.createProposalWithEscrow);

module.exports = router;
