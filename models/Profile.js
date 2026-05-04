const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    profileImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    theme: {
      type: String,
      enum: ["dark", "light"],
      default: "dark",
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);