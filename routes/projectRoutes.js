const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const protect = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.post("/", protect, upload.single("image"), createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;