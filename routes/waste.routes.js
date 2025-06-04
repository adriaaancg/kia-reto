const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const wasteController = require("../controllers/waste.controller");

router.post("/registry", auth, wasteController.createPendingWasteRecord);
router.get("/history", auth, wasteController.getPendingWasteRecords);
router.get("/history/:id", auth, wasteController.getPendingWasteRecord);
router.put("/history/:id", auth, wasteController.updatePendingWasteRecord);
router.delete("/history/:id", auth, wasteController.deletePendingWasteRecord);
router.post("/history/:id/confirm", auth, wasteController.confirmPendingWasteRecord);
router.get("/history-confirmed", auth, wasteController.getConfirmedWasteRecords);

module.exports = router;