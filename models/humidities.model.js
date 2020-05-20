const mongoose = require("mongoose");

const humiditySchema = new mongoose.Schema({
  type: String,
  value: String,
  date: String,
  time: String
});

const Humidity = mongoose.model("Humidity", humiditySchema, "humidities");

export default Humidity;