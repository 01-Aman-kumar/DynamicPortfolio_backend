// const Achievement = require("../models/Achievement");

// // @desc Create Achievement
// exports.createAchievement = async (req, res) => {
//   try {
//     const achievement = await Achievement.create({
//       ...req.body,
//       user: req.user.id, // will come from auth later
//     });

//     res.status(201).json(achievement);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc Get all achievements (for logged user)
// exports.getAchievements = async (req, res) => {
//   try {
//     const achievements = await Achievement.find({ user: req.user.id })
//       .sort({ order: 1, createdAt: -1 });

//     res.json(achievements);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user.id })
      .sort({ order: 1, createdAt: -1 });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Achievement = require("../models/Achievement");
const cloudinary = require("../config/cloudinary");

exports.createAchievement = async (req, res) => {
  try {
    let imageData = { url: "", public_id: "" };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "portfolio/achievements",
      });

      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const achievement = await Achievement.create({
      ...req.body,
      image: imageData,
      user: req.user.id,
    });

    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get public achievements by username
exports.getPublicAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({
      user: req.params.userId,
      isVisible: true,
    }).sort({ order: 1 });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update achievement
// exports.updateAchievement = async (req, res) => {
//   try {
//     const achievement = await Achievement.findById(req.params.id);

//     if (!achievement) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     // ownership check
//     if (achievement.user.toString() !== req.user.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const updated = await Achievement.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: "Not found" });
    }

    if (achievement.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let imageData = achievement.image;

    // 🔥 If new image uploaded
    if (req.file) {
      // delete old image
      if (achievement.image?.public_id) {
        await cloudinary.uploader.destroy(achievement.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "portfolio/achievements",
      });

      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const updated = await Achievement.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imageData,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: "Not found" });
    }

    if (achievement.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔥 delete image from cloudinary
    if (achievement.image?.public_id) {
      await cloudinary.uploader.destroy(achievement.image.public_id);
    }

    await achievement.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: "Not found" });
    }

    if (achievement.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};