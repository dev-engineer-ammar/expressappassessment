// const mongoose = require("mongoose");

// const timesheetSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     week: { type: Number, required: true },
//     dateRange: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ["COMPLETED", "INCOMPLETE", "MISSING"],
//       default: "INCOMPLETE",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Timesheet", timesheetSchema);
const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema(
  {
    week: { type: Number, required: true },
    dateRange: { type: String, required: true },
    status: {
      type: String,
      enum: ["COMPLETED", "INCOMPLETE", "MISSING"],
      default: "INCOMPLETE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timesheet", timesheetSchema);