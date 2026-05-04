const Skill = require("../models/Skill");

// CREATE
exports.createSkill = async (req, res) => {
  try {
    const skill = await Skill.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET (Admin)
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id }).sort({
      order: 1,
    });

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) return res.status(404).json({ message: "Not found" });

    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updated = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) return res.status(404).json({ message: "Not found" });

    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await skill.deleteOne();

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};