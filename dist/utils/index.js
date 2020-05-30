"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getCurrentTime = exports.getCurrentDate = exports.clearAllDocsWithDate = exports.clearAllDocs = exports.CONSTANT_TYPE = exports.getAllDocs = exports.getDocsWithTime = exports.getDocsWithDate = exports.createDocs = exports.createDoc = undefined;
exports.IsJsonString = IsJsonString;

var _flames = require("../models/flames.model");

var _flames2 = _interopRequireDefault(_flames);

var _humidities = require("../models/humidities.model");

var _humidities2 = _interopRequireDefault(_humidities);

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
	    value = _ref.value,
	    date = _ref.date,
	    time = _ref.time;

	var docsType = new typeName({ type: type, value: value, date: date, time: time });
	await docsType.save();
};

var createDoc = exports.createDoc = async function createDoc(_ref2) {
	var type = _ref2.type,
	    value = _ref2.value,
	    date = _ref2.date,
	    time = _ref2.time;

	var getTypes = {
		// "flame": () =>  handleGetType({typeName: Flame, type, value, date, time}),
		// "humidity": () => handleGetType({typeName: Humidity, type, value, date, time}),
		gas: function gas() {
			return handleGetType({ typeName: _gases2.default, type: type, value: value, date: date, time: time });
		},
		temperature: function temperature() {
			return handleGetType({ typeName: _temperatures2.default, type: type, value: value, date: date, time: time });
		},
		avgGas: function avgGas() {
			return handleGetType({ typeName: _avgGases2.default, type: type, value: value, date: date, time: time });
		},
		avgTemperature: function avgTemperature() {
			return handleGetType({ typeName: _avgTemperatures2.default, type: type, value: value, date: date, time: time });
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

// export const CONSTANT_TYPE_AVG = [
// 	{ type: "avgTemperature", model: AvgTemperatures },
// 	{ type: "avgGas", model: AvgGases },
// ];

// export const CONSTANT_TYPE = [
//   { type: "flame",       model: Flame },
//   { type: "gas",         model: Gas },
//   { type: "humidity",    model: Humidity },
//   { type: "temperature", model: Temperature }
// ];

function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

var clearAllDocs = exports.clearAllDocs = async function clearAllDocs(message) {
	// const broadcastRegex = /^delete/;
	if (message.includes("delete")) {
		var date = "May 27 2020";
		await _gases2.default.deleteMany({ date: date });
		await _temperatures2.default.deleteMany({ date: date });
		// await Flame.deleteMany({date});
		// await Humidity.deleteMany({date});
	}
};

var clearAllDocsWithDate = exports.clearAllDocsWithDate = async function clearAllDocsWithDate(date) {
	await _gases2.default.deleteMany({ date: date });
	await _temperatures2.default.deleteMany({ date: date });
	// const broadcastRegex = /^delete/;
	// await Flame.deleteMany({date});
	// await Humidity.deleteMany({date});
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