const express = require("express");
const router = express.Router();
const gigController = require("../controllers/gigController");
const { submitProposal } = require("../controllers/proposalController");

router.post("/", gigController.createGig);
router.get("/", gigController.getAllGigs);
router.get("/:id", gigController.getGigById);
router.put("/:id", gigController.updateGig);
router.delete("/:id", gigController.deleteGig);
router.post("/:id/proposals", submitProposal);


module.exports = router;