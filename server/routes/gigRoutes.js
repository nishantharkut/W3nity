const express = require("express");
const router = express.Router();
const gigController = require("../controllers/gigController");
const { submitProposal } = require("../controllers/proposalController");
const authMiddleware= require("../middlewares/authMiddleware")

router.post("/",authMiddleware, gigController.createGig);
router.get("/", gigController.getAllGigs);
router.get("/:id", gigController.getGigById);
router.put("/:id", gigController.updateGig);
router.delete("/:id", gigController.deleteGig);

//after web3
router.post("/:id/proposals", submitProposal);


module.exports = router;