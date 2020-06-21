const mongoose = require("mongoose");

const gasSchema = new mongoose.Schema({
	type: String,
	valueNode1: String,
	valueNode2: String,
	date: String,
	time: String,
});

const Gas = mongoose.model("Gas", gasSchema, "gases");

export default Gas;
