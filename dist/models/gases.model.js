"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var mongoose = require("mongoose");

var gasSchema = new mongoose.Schema({
	type: String,
	valueNode1: String,
	valueNode2: String,
	date: String,
	time: String
});

var Gas = mongoose.model("Gas", gasSchema, "gases");

exports.default = Gas;