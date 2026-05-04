const User = require("../models/User");
const Profile = require("../models/Profile");
const Achievement = require("../models/Achievement");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Education = require("../models/Education");
const cloudinary = require("../config/cloudinary");

// ================================
// CREATE / UPDATE PROFILE
// ================================
// exports.upsertProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     let profile = await Profile.findOne({ user: userId });

//     if (profile) {
//       profile = await Profile.findOneAndUpdate(
//         { user: userId },
//         req.body,
//         { new: true }
//       );
//       return res.json(profile);
//     }

//     profile = await Profile.create({
//       ...req.body,
//       user: userId,
//     });

//     res.status(201).json(profile);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.upsertProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let profile = await Profile.findOne({ user: userId });

    // 🔥 Handle image upload
    let imageData = profile?.profileImage || null;

    if (req.file) {
      // delete old image
      if (profile?.profileImage?.public_id) {
        await cloudinary.uploader.destroy(
          profile.profileImage.public_id
        );
      }

      imageData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // 🔥 Safe fields (avoid direct req.body spread)
    const updateData = {
      name: req.body.name,
      title: req.body.title,
      bio: req.body.bio,
      resumeUrl: req.body.resumeUrl,
      theme: req.body.theme,
      socialLinks: {
        github: req.body.github,
        linkedin: req.body.linkedin,
      },
      profileImage: imageData,
    };

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: userId },
        updateData,
        { new: true }
      );

      return res.json({
        success: true,
        data: profile,
      });
    }

    profile = await Profile.create({
      ...updateData,
      user: userId,
    });

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error saving profile",
    });
  }
};


// ================================
// GET MY PROFILE
// ================================
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", "username email");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// PUBLIC PORTFOLIO API
// ================================
exports.getPortfolioByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // 1. Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Get public profile
    const profile = await Profile.findOne({
      user: user._id,
      isPublic: true,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Portfolio is private or not available",
      });
    }

    // 3. Parallel queries (FAST)
    const [achievements, projects, skills, education] =
      await Promise.all([
        Achievement.find({
          user: user._id,
          isVisible: true,
        }).sort({ order: 1, createdAt: -1 }),

        Project.find({
          user: user._id,
          isVisible: true,
        }).sort({ featured: -1, order: 1 }),

        Skill.find({
          user: user._id,
        }).sort({ order: 1 }),

        Education.find({
          user: user._id,
        }).sort({ startDate: -1 }),
      ]);

    // 4. Response
    res.json({
      success: true,
      data: {
        profile,
        achievements,
        projects,
        skills,
        education,
      },
    });
  } catch (error) {
    console.error("Portfolio Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};