const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getPublicAchievements,
  getAchievements,
  getSingleAchievement,
} = require("../controllers/achievementController.js");

// PUBLIC
router.get("/public/:userId", getPublicAchievements);

// PRIVATE
router.post("/", protect, upload.single("image"), createAchievement);
router.get("/", protect, getAchievements);
router.get("/:id", protect, getSingleAchievement);
router.put("/:id", protect, upload.single("image"), updateAchievement);
router.delete("/:id", protect, deleteAchievement);

module.exports = router;