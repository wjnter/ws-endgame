"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require("mongoose");

var humiditySchema = new mongoose.Schema({
  type: String,
  value: String,
  date: String,
  time: String
});

var Humidity = mongoose.model("Humidity", humiditySchema, "humidities");

exports.default = Humidity;