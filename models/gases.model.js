const mongoose = require("mongoose");

const gasSchema = new mongoose.Schema({
  type: String,
  value: String,
  date: String,
  time: String
});

const Gas = mongoose.model("Gas", gasSchema, "gases");

export default Gas;