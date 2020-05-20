"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentDate = exports.clearAllDocs = exports.CONSTANT_TYPE = exports.getDocs = exports.createDocs = exports.createDoc = undefined;
exports.IsJsonString = IsJsonString;

var _flames = require("../models/flames.model");

var _flames2 = _interopRequireDefault(_flames);

var _gases = require("../models/gases.model");

var _gases2 = _interopRequireDefault(_gases);

var _humidities = require("../models/humidities.model");

var _humidities2 = _interopRequireDefault(_humidities);

var _temperatures = require("../models/temperatures.model");

var _temperatures2 = _interopRequireDefault(_temperatures);

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
    "flame": function flame() {
      return handleGetType({ typeName: _flames2.default, type: type, value: value, date: date, time: time });
    },
    "humidity": function humidity() {
      return handleGetType({ typeName: _humidities2.default, type: type, value: value, date: date, time: time });
    },
    "gas": function gas() {
      return handleGetType({ typeName: _gases2.default, type: type, value: value, date: date, time: time });
    },
    "temperature": function temperature() {
      return handleGetType({ typeName: _temperatures2.default, type: type, value: value, date: date, time: time });
    }
  };
  getTypes[type]();
};

var createDocs = exports.createDocs = function createDocs(message, createDoc) {
  var docs = JSON.parse(message);
  docs.map(createDoc);
};

var getDocs = exports.getDocs = async function getDocs(regExpTime, model) {
  return await model.find({ time: regExpTime });
};

var CONSTANT_TYPE = exports.CONSTANT_TYPE = [{
  type: "flame",
  model: _flames2.default
}, {
  type: "gas",
  model: _gases2.default
}, {
  type: "humidity",
  model: _humidities2.default
}, {
  type: "temperature",
  model: _temperatures2.default
}];

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
  if (message.includes('delete')) {
    var date = "May 05 2020";
    await _flames2.default.deleteMany({ date: date });
    await _gases2.default.deleteMany({ date: date });
    await _humidities2.default.deleteMany({ date: date });
    await _temperatures2.default.deleteMany({ date: date });
  }
};

var getCurrentDate = exports.getCurrentDate = function getCurrentDate() {
  var fullDate = new Date();
  var CONSTANT_MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = fullDate.getFullYear();
  var month = fullDate.getMonth();
  var date = fullDate.getDate();

  return CONSTANT_MONTH[month] + " " + date + " " + year;
};