require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("../routes/auth");
const timesheetRoutes = require("../routes/timesheets");
const entryRoutes = require("../routes/changeEnts");
const projectRoutes = require("../routes/projects");


const app = express();
app.use(cors());
app.use(express.json());

let conn = null;
async function connectDB() {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGODB_URI);
  return conn;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (e) {
    res.status(500).json({ message: "DB connection failed", error: e.message });
  }
});

app.get("/", (req, res) => res.json({ status: "ok", message: "API running" }));
app.use("/api/auth", authRoutes);
app.use("/api/timesheets", timesheetRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/projects", projectRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
}

module.exports = app;
