const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const {
  upsertProfile,
  getMyProfile,
  getPortfolioByUsername,
  getPublicPortfolios,
} = require("../controllers/profileController");

// Protected
// router.post("/", protect, upsertProfile);
router.post("/", protect, upload.single("image"), upsertProfile);
router.get("/me", protect, getMyProfile);

// Public
router.get("/:username", getPortfolioByUsername);
router.get("/all/public", getPublicPortfolios);

module.exports = router;