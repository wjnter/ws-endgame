"use strict";

var _avgTemperatures = require("./models/avgTemperatures.model");

var _avgTemperatures2 = _interopRequireDefault(_avgTemperatures);

var _avgGases = require("./models/avgGases.model");

var _avgGases2 = _interopRequireDefault(_avgGases);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**************************websocket_example.js*************************************************/

var bodyParser = require("body-parser");
var express = require("express"); //express framework to have a higher level of methods
var app = express(); //assign app variable the express class/method
var http = require("http");
var mongoose = require("mongoose");

var userName = "tptdong97";
var password = "admin";
var dbName = "endgame_ute";

// const uri = `mongodb+srv://${userName}:${password}@endgame-ute-3eiy7.mongodb.net/${dbName}?retryWrites=true&w=majority`;
var uri = "mongodb://localhost/end-game";
var port = process.env.PORT || 3300;

mongoose.connect(process.env.MONGODB_URI || uri).catch(function (err) {
	return console.log("err here::::", err);
});

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
/*-------------------------------ws chat server----------------------------------*/

wss.on("connection", async function (ws, req) {
	var dataset = [];
	// const currentFullDate = "May 31 2020";
	var currentFullDate = "";
	// let currentFullDate = "Jul 10 2020";
	// RegExp time to query docs
	var currentTimeWithHourAndMin = (0, _utils.getCurrentTimeAndDate)("hourAndMin");
	// currentTimeWithHourAndMin: ---  /14:15/i
	var regExpTime = new RegExp(currentTimeWithHourAndMin, "i");

	// use for..of, since map or forEach cannot do async
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = _utils.CONSTANT_TYPE[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var item = _step.value;
			var type = item.type,
			    model = item.model;
			// Get all docs at current time within a min

			if (!type.includes("avgTemperature") && !type.includes("avgGas")) {
				var doc = await (0, _utils.getDocsWithTime)(regExpTime, model);
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

	/******* when server receives message from client trigger function with argument message *****/
	ws.on("message", async function (message) {
		var avgDailyDataset = [];
		var newMessage = "";
		var currentDate = (0, _utils.getCurrentTimeAndDate)("date");
		var currentTime = (0, _utils.getCurrentTimeAndDate)("wholeTime");
		// const currentDate = "May 31 2020";
		// const isNewDate = currentFullDate !== "Jul 09 2020";
		var isNewDate = currentFullDate !== currentDate;
		if (isNewDate && currentFullDate !== "") {
			var dataOfPreviousDate = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = _utils.CONSTANT_TYPE[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;
					var type = item.type,
					    model = item.model;

					var doc = void 0;
					// Get all docs at the previous day
					if (!type.includes("avgTemperature") && !type.includes("avgGas")) {
						doc = await (0, _utils.getDocsWithDate)(currentFullDate, model);
						if (doc.length) {
							var _doc$ = doc[1],
							    _type = _doc$.type,
							    valueNode1 = _doc$.valueNode1,
							    valueNode2 = _doc$.valueNode2,
							    date = _doc$.date,
							    time = _doc$.time;

							var newAvgDocs = { type: _type, valueNode1: valueNode1, valueNode2: valueNode2, date: date, time: time };
							// Compute the average value to create new docs
							var avgValueNode1 = (0, _utils.getAvgValue)(doc, "valueNode1");
							var avgValueNode2 = (0, _utils.getAvgValue)(doc, "valueNode2");
							newAvgDocs.valueNode1 = "" + Math.round(avgValueNode1);
							newAvgDocs.valueNode2 = "" + Math.round(avgValueNode2);
							newAvgDocs.type = "avg" + newAvgDocs.type[0].toUpperCase() + newAvgDocs.type.slice(1);
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

			await (0, _utils.createDocs)(JSON.stringify(dataOfPreviousDate), _utils.createDoc);
			dataOfPreviousDate.length = 0;
			// Clear all docs of the previous day
			await (0, _utils.clearAllDocsWithDate)(currentFullDate);

			currentFullDate = currentDate;
		}
		if (isNewDate) currentFullDate = currentDate;

		var isJson = (0, _utils.IsJsonString)(message);
		if (isJson) {
			var objMessage = JSON.parse(message);
			objMessage.forEach(function (obj) {
				obj.date = currentDate;
				obj.time = currentTime;
			});
			newMessage = JSON.stringify(objMessage);
		}

		isJson ? (0, _utils.createDocs)(newMessage, _utils.createDoc) : await (0, _utils.clearAllDocsWithDate)(message);

		if (message === "getAvgData") {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = _utils.CONSTANT_TYPE[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _item = _step3.value;
					var type = _item.type,
					    model = _item.model;

					if (type.includes("avgTemperature") && model === _avgTemperatures2.default || type.includes("avgGas") && model === _avgGases2.default) {
						var avgDoc = await (0, _utils.getAllDocs)(model);
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

			ws.send(JSON.stringify([message, avgDailyDataset]));
			avgDailyDataset.length = 0;
		}
		if (message === "burn" || message === "saw") {
			//token of my iphone
			await (0, _utils.sendPushNotification)(message, "ExponentPushToken[pug8SfIShcNnZF9kKpocfV]");
		}

		// console.log("Received: " + message);
		wss.clients.forEach(function (client) {
			// Send all clients including sender.
			client.readyState && isJson && client.send(newMessage);
		});
	});
	ws.on("close", function () {
		console.log("lost one client");
	});
});

server.listen(port, function () {
	console.log("Listening at port: ", port);
});