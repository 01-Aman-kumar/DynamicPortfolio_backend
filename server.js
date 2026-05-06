const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const fs=require("fs");
const path=require("path");
const connectDB = require("./config/db");
const achievementRoutes = require("./routes/achievementRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
const educationRoutes = require("./routes/educationRoutes");
dotenv.config();

// Connect DB
connectDB();

const app = express();

// ================= LOG FILE SETUP =================

// create logs folder
const logDirectory = path.join(__dirname, "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// create access.log file
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

// save logs
app.use(morgan("combined", { stream: accessLogStream }));

// Middleware
app.use(cors({
  origin: "https://dynamic-portfolio-eight-nu.vercel.app",
  // origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/achievements", achievementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/portfolio", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/education", educationRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);