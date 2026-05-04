const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createEducation,
  getEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController");

router.post("/", protect, createEducation);
router.get("/", protect, getEducation);
router.put("/:id", protect, updateEducation);
router.delete("/:id", protect, deleteEducation);

module.exports = router;