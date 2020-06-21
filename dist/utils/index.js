"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getAvgValue = exports.getCurrentTime = exports.getCurrentDate = exports.clearAllDocsWithDate = exports.clearAllDocs = exports.CONSTANT_TYPE = exports.getAllDocs = exports.getDocsWithTime = exports.getDocsWithDate = exports.createDocs = exports.createDoc = undefined;
exports.IsJsonString = IsJsonString;

var _gases = require("../models/gases.model");

var _gases2 = _interopRequireDefault(_gases);

var _temperatures = require("../models/temperatures.model");

var _temperatures2 = _interopRequireDefault(_temperatures);

var _avgGases = require("../models/avgGases.model");

var _avgGases2 = _interopRequireDefault(_avgGases);

var _avgTemperatures = require("../models/avgTemperatures.model");

var _avgTemperatures2 = _interopRequireDefault(_avgTemperatures);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleGetType = async function handleGetType(_ref) {
	var typeName = _ref.typeName,
	    type = _ref.type,
	    valueNode1 = _ref.valueNode1,
	    valueNode2 = _ref.valueNode2,
	    date = _ref.date,
	    time = _ref.time;

	var docsType = new typeName({ type: type, valueNode1: valueNode1, valueNode2: valueNode2, date: date, time: time });
	await docsType.save();
};

var createDoc = exports.createDoc = async function createDoc(_ref2) {
	var type = _ref2.type,
	    valueNode1 = _ref2.valueNode1,
	    valueNode2 = _ref2.valueNode2,
	    date = _ref2.date,
	    time = _ref2.time;

	var getTypes = {
		gas: function gas() {
			return handleGetType({
				typeName: _gases2.default,
				type: type,
				valueNode1: valueNode1,
				valueNode2: valueNode2,
				date: date,
				time: time
			});
		},
		temperature: function temperature() {
			return handleGetType({
				typeName: _temperatures2.default,
				type: type,
				valueNode1: valueNode1,
				valueNode2: valueNode2,
				date: date,
				time: time
			});
		},
		avgGas: function avgGas() {
			return handleGetType({
				typeName: _avgGases2.default,
				type: type,
				valueNode1: valueNode1,
				valueNode2: valueNode2,
				date: date,
				time: time
			});
		},
		avgTemperature: function avgTemperature() {
			return handleGetType({
				typeName: _avgTemperatures2.default,
				type: type,
				valueNode1: valueNode1,
				valueNode2: valueNode2,
				date: date,
				time: time
			});
		}
	};
	getTypes[type]();
};

var createDocs = exports.createDocs = function createDocs(message, createDoc) {
	var docs = JSON.parse(message);
	docs.map(createDoc);
};

var getDocsWithDate = exports.getDocsWithDate = async function getDocsWithDate(date, model) {
	return await model.find({ date: date });
};
var getDocsWithTime = exports.getDocsWithTime = async function getDocsWithTime(time, model) {
	return await model.find({ time: time });
};
var getAllDocs = exports.getAllDocs = async function getAllDocs(model) {
	return await model.find({});
};

var CONSTANT_TYPE = exports.CONSTANT_TYPE = [{ type: "temperature", model: _temperatures2.default }, { type: "gas", model: _gases2.default }, { type: "avgTemperature", model: _avgTemperatures2.default }, { type: "avgGas", model: _avgGases2.default }];

function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

var clearAllDocs = exports.clearAllDocs = async function clearAllDocs(date) {
	await _gases2.default.deleteMany({ date: date });
	await _temperatures2.default.deleteMany({ date: date });
};

var clearAllDocsWithDate = exports.clearAllDocsWithDate = async function clearAllDocsWithDate(date) {
	await _gases2.default.deleteMany({ date: date });
	await _temperatures2.default.deleteMany({ date: date });
};

var getCurrentDate = exports.getCurrentDate = function getCurrentDate(_) {
	var fullDate = new Date();
	var CONSTANT_MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var year = fullDate.getFullYear();
	var month = fullDate.getMonth();
	var date = fullDate.getDate();

	return CONSTANT_MONTH[month] + " " + date + " " + year;
};

var getCurrentTime = exports.getCurrentTime = function getCurrentTime(_) {
	var currentTime = new Date();
	var hour = currentTime.getHours();
	var min = currentTime.getMinutes();

	return (hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min);
};

var getAvgValue = exports.getAvgValue = function getAvgValue(doc, valueNode) {
	return doc.reduce(function (acc, curr) {
		return acc + +curr[valueNode];
	}, 0) / doc.length;
};