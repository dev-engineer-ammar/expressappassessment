const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  date: String,
  taskName: String,
  hours: Number,
  projectName: String,
  typeOfWork: String,
  description: String,
});

module.exports = mongoose.model("changeEnt", entrySchema);