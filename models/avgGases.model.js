const mongoose = require("mongoose");

const avgGasesSchema = new mongoose.Schema({
  type: String,
  value: String,
  date: String,
  time: String
});

const AvgGases = mongoose.model("AvgGases", avgGasesSchema, "avgGases");

export default AvgGases;