const express = require("express");
const router = express.Router();

const {
  createClaim,
  approveClaim,
  rejectClaim
} = require("../controllers/claimController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post("/", authMiddleware, createClaim);

router.put("/approve/:id", authMiddleware, adminMiddleware, approveClaim);

router.put("/reject/:id", authMiddleware, adminMiddleware, rejectClaim);

module.exports = router;
