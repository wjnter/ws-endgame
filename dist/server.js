"use strict";

var _avgTemperatures = require("./models/avgTemperatures.model");

var _avgTemperatures2 = _interopRequireDefault(_avgTemperatures);

var _avgGases = require("./models/avgGases.model");

var _avgGases2 = _interopRequireDefault(_avgGases);

var _index = require("./utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**************************websocket_example.js*************************************************/

var bodyParser = require("body-parser");
var express = require("express"); //express framework to have a higher level of methods
var app = express(); //assign app variable the express class/method
var http = require("http");
var path = require("path");
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/end-game");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var server = http.createServer(app); //create a server

//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require("dns").lookup(require("os").hostname(), function (err, add, fam) {
	console.log("addr: " + add);
});

/*-------------------------------websocket setup----------------------------------*/
//var expressWs = require('express-ws')(app,server);
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ server: server });

app.get("/", function (req, res) {
	res.send("hello");
});

// when browser sends get request, send html file to browser
// viewed at http://localhost:3300
// app.get("/", (req, res) => {
// 	res.sendFile(path.join(__dirname + "/index.html"));
// });

/*-------------------------------ws chat server----------------------------------*/

//app.ws('/echo', function(ws, req) {
wss.on("connection", async function (ws, req) {
	var dataset = [];
	var timeNow = (0, _index.getCurrentTime)();
	var currentFullDate = "";
	// RegExp time to query docs
	var regExpTime = new RegExp(timeNow, "i");

	// use for..of bcuz map or forEach cannot do async
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = _index.CONSTANT_TYPE[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var item = _step.value;
			var type = item.type,
			    model = item.model;
			// Get all docs at current time within a min

			if (!type.includes("avgTemperature") && !type.includes("avgGas")) {
				var doc = await (0, _index.getDocsWithTime)(regExpTime, model);
				dataset.push(doc.slice(-1)[0]);
			}
		}

		// Send the last document to the client that has been connected
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	ws.send(JSON.stringify(dataset));

	/******* when server receives messsage from client trigger function with argument message *****/
	ws.on("message", async function (message) {
		// Get current hour and min to generate regexp to query
		var avgDailyDataset = [];
		// const fullDateNow = "May 31 2020";
		var fullDateNow = (0, _index.getCurrentDate)();
		var isNewDate = currentFullDate !== fullDateNow;

		if (isNewDate && currentFullDate !== "") {
			var dataOfPreviousDate = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = _index.CONSTANT_TYPE[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;
					var type = item.type,
					    model = item.model;

					var doc = void 0;
					// Get all docs at the previous day
					if (!type.includes("avgTemperature") && !type.includes("avgGas")) {
						doc = await (0, _index.getDocsWithDate)(currentFullDate, model);
						if (doc.length) {
							var _doc$ = doc[1],
							    _type = _doc$.type,
							    value = _doc$.value,
							    date = _doc$.date,
							    time = _doc$.time;

							var newAvgDocs = { type: _type, value: value, date: date, time: time };
							// Compute the average value to create new docs
							var avgValue = doc.reduce(function (acc, curr) {
								return acc + +curr.value;
							}, 0) / doc.length;
							newAvgDocs.type = "avg" + newAvgDocs.type[0].toUpperCase() + newAvgDocs.type.slice(1);
							newAvgDocs.value = "" + Math.round(avgValue);
							dataOfPreviousDate.push(newAvgDocs);
						}
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			await (0, _index.createDocs)(JSON.stringify(dataOfPreviousDate), _index.createDoc);
			dataOfPreviousDate.length = 0;
			// Clear all docs of the previous day
			await (0, _index.clearAllDocsWithDate)(currentFullDate);

			currentFullDate = fullDateNow;
		}

		var isJson = (0, _index.IsJsonString)(message);

		isJson ? (0, _index.createDocs)(message, _index.createDoc) : await (0, _index.clearAllDocs)(message);

		if (message === "getAvgData") {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = _index.CONSTANT_TYPE[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _item = _step3.value;
					var type = _item.type,
					    model = _item.model;

					if (type.includes("avgTemperature") && model === _avgTemperatures2.default || type.includes("avgGas") && model === _avgGases2.default) {
						var avgDoc = await (0, _index.getAllDocs)(model);
						avgDailyDataset.push.apply(avgDailyDataset, _toConsumableArray(avgDoc));
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			ws.send(JSON.stringify(["getAvgData", avgDailyDataset]));
			avgDailyDataset.length = 0;
		}

		// console.log("Received: " + message);
		wss.clients.forEach(function (client) {
			// Send all clients including sender.
			client.readyState && isJson && client.send(message);
		});
	});
	ws.on("close", function () {
		console.log("lost one client");
	});
});

server.listen(3300);