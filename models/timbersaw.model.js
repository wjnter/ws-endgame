const mongoose = require("mongoose");

const timbersawSchema = new mongoose.Schema({
	type: String,
	valueNode1: String,
	valueNode2: String,
	date: String,
	time: String,
});

const Timbersaw = mongoose.model("Timbersaw", timbersawSchema, "timbersaw");

export default Timbersaw;
