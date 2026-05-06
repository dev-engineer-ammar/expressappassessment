const express = require("express");
const Project = require("../models/Project");

const router = express.Router();

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();

    res.json(
      projects.map((p) => ({
        id: p._id,
        name: p.name,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

module.exports = router;