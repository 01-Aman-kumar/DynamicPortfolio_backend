const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const protect = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getPublicProjects,
} = require("../controllers/projectController");
router.get("/public", getPublicProjects);

router.post("/", protect, upload.single("image"), createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);


module.exports = router;