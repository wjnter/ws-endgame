"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var mongoose = require("mongoose");

var temperatureSchema = new mongoose.Schema({
	type: String,
	valueNode1: String,
	valueNode2: String,
	date: String,
	time: String
});

var Temperature = mongoose.model("Temperature", temperatureSchema, "temperatures");

exports.default = Temperature;