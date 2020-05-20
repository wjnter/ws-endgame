const mongoose = require("mongoose");

const flameSchema = new mongoose.Schema({
  type: String,
  value: String,
  date: String,
  time: String
});

const Flame = mongoose.model("Flame", flameSchema, "flames");

export default Flame;