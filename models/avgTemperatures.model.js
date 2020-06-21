const mongoose = require("mongoose");

const avgTemperaturesSchema = new mongoose.Schema({
	type: String,
	valueNode1: String,
	valueNode2: String,
	date: String,
	time: String,
});

const AvgTemperatures = mongoose.model(
	"AvgTemperatures",
	avgTemperaturesSchema,
	"avgTemperatures"
);

export default AvgTemperatures;
