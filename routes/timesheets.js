const express = require("express");
const Timesheet = require("../models/Timesheet");
const protect = require("../middleware/auth");

const router = express.Router();

// router.use(protect);

// GET /api/timesheets
// router.get("/", async (req, res) => {
//   const items = await Timesheet.find();
//   res.json({
//     timesheets: items.map((t) => ({
//       id: t._id.toString(),
//       week: t.week,
//      startDate: t.startDate,
//     endDate:t.endDate,
//       status: t.status,
//     })),
//   });
// });
router.get("/", async (req, res) => {
  try {
    // 1. Get parameters from query string (with defaults)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const status = req.query.status;
    const sort = req.query.sort === "desc" ? -1 : 1;

    // 2. Build the filter object
    const query = {};
    if (status && status !== "ALL") {
      query.status = status;
    }

    // 3. Execute query with pagination
    const items = await Timesheet.find(query)
      .sort({ week: sort }) // Sort by week number
      .skip((page - 1) * limit) // Skip items from previous pages
      .limit(limit); // Only take the amount for the current page

    // 4. Get total count for the frontend to calculate totalPages
    const total = await Timesheet.countDocuments(query);

    res.json({
      total,
      page,
      pageSize: limit,
      timesheets: items.map((t) => ({
        id: t._id.toString(),
        weekNumber: t.week, // Matches your frontend interface
        startDate: t.startDate,
        endDate: t.endDate,
        status: t.status,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching timesheets" });
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
