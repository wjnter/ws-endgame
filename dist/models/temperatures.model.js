"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require("mongoose");

var temperatureSchema = new mongoose.Schema({
  type: String,
  value: String,
  date: String,
  time: String
});

var Temperature = mongoose.model("Temperature", temperatureSchema, "temperatures");

exports.default = Temperature;