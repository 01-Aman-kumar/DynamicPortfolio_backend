const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");


// ========================
// CREATE PROJECT
// ========================
exports.createProject = async (req, res) => {
  try {
    const imageData = req.file
      ? {
          url: req.file.path,
          public_id: req.file.filename,
        }
      : null;

    const project = await Project.create({
      ...req.body,
      user: req.user.id,
      image: imageData,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating project",
    });
  }
};


// ========================
// GET PROJECTS (ADMIN)
// ========================
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id })
      .sort({ featured: -1, order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
    });
  }
};


// ========================
// UPDATE PROJECT
// ========================
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔥 Handle image replacement
    let imageData = project.image;

    if (req.file) {
      // delete old image
      if (project.image?.public_id) {
        await cloudinary.uploader.destroy(project.image.public_id);
      }

      // new image
      imageData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imageData,
      },
      { returnDocument: 'after' }
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating project",
    });
  }
};


// ========================
// DELETE PROJECT
// ========================
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔥 Delete image from Cloudinary
    if (project.image?.public_id) {
      await cloudinary.uploader.destroy(project.image.public_id);
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting project",
    });
  }
};

exports.getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      isVisible: true,
    })
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .select("-user"); // hide user field

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching public projects",
    });
  }
};

exports.getProjectsAdvanced = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 6 } = req.query;

    const query = {
      user: req.user.id,
      title: { $regex: search, $options: "i" },
    };

    const projects = await Project.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: projects,
      total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
    });
  }
};



exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      isVisible: true,
      featured: true,
    }).limit(6);

    res.json({
      success: true,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured projects",
    });
  }
};