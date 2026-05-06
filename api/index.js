require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("../routes/auth");
const timesheetRoutes = require("../routes/timesheets");
const entryRoutes = require("../routes/entries");
const projectRoutes = require("../routes/projects");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Better DB connection (serverless safe)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ connect DB before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (e) {
    console.error("DB ERROR:", e);
    res.status(500).json({
      message: "Database connection failed",
      error: e.message,
    });
  }
});

// routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/timesheets", timesheetRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/projects", projectRoutes);

// ✅ Only for local dev (NOT used by Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;