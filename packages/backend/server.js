const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import routes
const articleRoutes = require("./routes/articles");
const newsRoutes = require("./routes/newsRoutes");
const predictionRoutes = require("./routes/predictions");
const adminRoutes = require("./routes/admin"); // <-- Import Admin/Sync route

console.log("✅✅✅ --- server.js file loaded successfully! --- ✅✅✅");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

// ========== API ROUTES ==========
app.use("/api/articles", articleRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/admin", adminRoutes); // <-- Mount the admin route

// Keep your seed route if you still need it, otherwise this new admin route replaces it
// app.use("/api/dev", require("./routes/dev/seedPredictions"));

// ========== HEARTBEAT ==========
app.get("/", (req, res) => {
  res.status(200).send("<h1>Server is alive and running the LATEST code!</h1>");
});

// ========== LISTENER ==========
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);
