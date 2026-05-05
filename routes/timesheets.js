const express = require("express");
const Timesheet = require("../models/Timesheet");
const protect = require("../middleware/auth");

const router = express.Router();

// router.use(protect);

// GET /api/timesheets
router.get("/", async (req, res) => {
  const items = await Timesheet.find({ user: req.user._id }).sort({ week: 1 });
  res.json({
    timesheets: items.map((t) => ({
      id: t._id.toString(),
      week: t.week,
      dateRange: t.dateRange,
      status: t.status,
    })),
  });
});

// POST /api/timesheets
router.post("/", async (req, res) => {
  const { week, dateRange, status } = req.body;

  const t = await Timesheet.create({
    week,
    dateRange,
    status,
  });

  res.status(201).json({
    id: t._id.toString(),
    week: t.week,
    dateRange: t.dateRange,
    status: t.status,
  });
});
// PUT /api/timesheets/:id
router.put("/:id", async (req, res) => {
  const t = await Timesheet.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!t) return res.status(404).json({ message: "Not found" });
  res.json({
    id: t._id.toString(),
    week: t.week,
    dateRange: t.dateRange,
    status: t.status,
  });
});

// DELETE /api/timesheets/:id
router.delete("/:id", async (req, res) => {
  const t = await Timesheet.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!t) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
});

module.exports = router;
