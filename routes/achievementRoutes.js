const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createAchievement,
  getAchievements,
  getPublicAchievements,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/achievementController");

// (Auth middleware will be added next step)


// Protected routes
router.post("/", protect, createAchievement);
router.get("/", protect, getAchievements);
router.put("/:id", protect, updateAchievement);
router.delete("/:id", protect, deleteAchievement);

// Public route
router.get("/public/:userId", getPublicAchievements);

module.exports = router;