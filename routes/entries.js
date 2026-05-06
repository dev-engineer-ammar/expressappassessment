const express = require("express");
const Entry = require("../models/entry");

const router = express.Router();

// GET /api/entries?timesheetId=123
router.get("/", async (req, res) => {
  try {
    const { timesheetId } = req.query;

    const entries = await Entry.find({ timesheetId });

    res.json(
      entries.map((e) => ({
        id: e._id,
        timesheetId: e.timesheetId,
        date: e.date,
        taskName: e.taskName,
        hours: e.hours,
        projectName: e.projectName,
        typeOfWork: e.typeOfWork,
        description: e.description,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Error fetching entries" });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const entry = await Entry.create(req.body);

    res.status(201).json({
      id: entry._id,
      ...entry._doc,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating entry" });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
      id: entry._id,
      ...entry._doc,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating entry" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting entry" });
  }
});

module.exports = router;