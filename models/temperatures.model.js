const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
	type: String,
	valueNode1: String,
	valueNode2: String,
	date: String,
	time: String,
});

const Temperature = mongoose.model(
	"Temperature",
	temperatureSchema,
	"temperatures"
);

export default Temperature;
