const express = require("express");
const Timesheet = require("../models/Timesheet");
const protect = require("../middleware/auth");

const router = express.Router();

// router.use(protect);

// 

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; 
    const status = req.query.status;
    const sort = req.query.sort === "desc" ? -1 : 1;

    const query = {};
    if (status && status !== "ALL" && status !== "") {
      query.status = status;
    }

    const items = await Timesheet.find(query)
      .sort({ week: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Timesheet.countDocuments(query);

    res.json({
      items: items.map((t) => ({
        id: t._id.toString(),
        weekNumber: t.week,
        startDate: t.startDate,
        endDate: t.endDate,
        status: t.status,
        totalHours: 0,
        targetHours: 40,
      })),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching timesheets" });
  }
});

// GET /api/timesheets/:id
router.get("/:id", async (req, res) => {
  try {
    const t = await Timesheet.findById(req.params.id);

    if (!t) return res.status(404).json({ message: "Not found" });

    res.json({
      id: t._id.toString(),
      weekNumber: t.week,
      startDate: t.startDate,
      endDate: t.endDate,
      status: t.status,
      totalHours: 0,
      targetHours: 40,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching timesheet" });
  }
});

// POST /api/timesheets
router.post("/", async (req, res) => {
  const { week, startDate, endDate,status } = req.body;

  const t = await Timesheet.create({
    week,
    startDate,
    endDate,
    status,
  });

  res.status(201).json({
    id: t._id.toString(),
    week: t.week,
    startDate: t.startDate,
    endDate:t.endDate,
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
    startDate: t.startDate,
    endDate:t.endDate,
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
