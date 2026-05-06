const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  timesheetId: { type: mongoose.Schema.Types.ObjectId, ref: "Timesheet" },
  date: String,
  taskName: String,
  hours: Number,
  projectName: String,
  typeOfWork: String,
  description: String,
});

module.exports = mongoose.model("Entry", entrySchema);