const Education = require("../models/Education");

// CREATE
exports.createEducation = async (req, res) => {
  try {
    const edu = await Education.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(edu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET (Admin)
exports.getEducation = async (req, res) => {
  try {
    const data = await Education.find({ user: req.user.id }).sort({
      startDate: -1,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateEducation = async (req, res) => {
  try {
    const edu = await Education.findById(req.params.id);

    if (!edu) return res.status(404).json({ message: "Not found" });

    if (edu.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updated = await Education.findByIdAndUpdate(
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
exports.deleteEducation = async (req, res) => {
  try {
    const edu = await Education.findById(req.params.id);

    if (!edu) return res.status(404).json({ message: "Not found" });

    if (edu.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await edu.deleteOne();

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};