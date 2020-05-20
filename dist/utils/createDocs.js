"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var createDocs = async function createDocs(_ref2) {
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
  getTypes[type];
};

exports.default = createDocs;