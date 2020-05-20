"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require("mongoose");

var gasSchema = new mongoose.Schema({
  type: String,
  value: String,
  date: String,
  time: String
});

var Gas = mongoose.model("Gas", gasSchema, "gases");

exports.default = Gas;