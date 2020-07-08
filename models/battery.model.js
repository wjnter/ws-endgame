const mongoose = require("mongoose");

const batterySchema = new mongoose.Schema({
	type: String,
	valueNode1: String,
	valueNode2: String,
	date: String,
	time: String,
});

const Battery = mongoose.model("Battery", batterySchema, "battery");

export default Battery;
