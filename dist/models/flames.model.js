"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require("mongoose");

var flameSchema = new mongoose.Schema({
  type: String,
  value: String,
  date: String,
  time: String
});

var Flame = mongoose.model("Flame", flameSchema, "flames");

exports.default = Flame;