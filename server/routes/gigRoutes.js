const express = require("express");
const router = express.Router();
const gigController = require("../controllers/gigController");

router.post("/", gigController.createGig);
router.get("/", gigController.getAllGigs);
router.get("/:id", gigController.getGigById);
router.put("/:id", gigController.updateGig);
router.delete("/:id", gigController.deleteGig);

module.exports = router;