"use strict";

var _flames = require("./models/flames.model");

var _flames2 = _interopRequireDefault(_flames);

var _gases = require("./models/gases.model");

var _gases2 = _interopRequireDefault(_gases);

var _humidities = require("./models/humidities.model");

var _humidities2 = _interopRequireDefault(_humidities);

var _temperatures = require("./models/temperatures.model");

var _temperatures2 = _interopRequireDefault(_temperatures);

var _index = require("./utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**************************websocket_example.js*************************************************/

var bodyParser = require("body-parser");
var express = require("express"); //express framework to have a higher level of methods
var app = express(); //assign app variable the express class/method
var http = require("http");
var path = require("path");
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
var WebSocket = require("ws");
var wss = new WebSocket.Server({ server: server });

//when browser sends get request, send html file to browser
// viewed at http://localhost:3300
// app.get("/", (req, res) => {
// 	res.sendFile(path.join(__dirname + "/index.html"));
// });

/*-------------------------------ws chat server----------------------------------*/

//app.ws('/echo', function(ws, req) {
wss.on("connection", async function (ws, req) {
	var dataset = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = _index.CONSTANT_TYPE[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var item = _step.value;
			var model = item.model;
			// Get current hour and min to generate regexp to query

			var hour = new Date().getHours();
			var min = new Date().getMinutes();
			var regExpTimeGet = new RegExp(hour + ":" + min, "i");
			var currentFullDate = (0, _index.getCurrentDate)();
			console.log("::::::currentFullDate", currentFullDate);

			var regExpTimeDelete = new RegExp();
			// Get all docs at current time within a min
			var doc = await (0, _index.getDocs)(regExpTimeGet, model);
			dataset.push(doc.slice(-1)[0]);
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
		var isJson = (0, _index.IsJsonString)(message);

		isJson ? (0, _index.createDocs)(message, _index.createDoc) : await (0, _index.clearAllDocs)(message);

		console.log("Received: " + message);
		wss.clients.forEach(function (client) {
			// Send all clients including sender.
			client.readyState && client.send(message);
		});
	});
	ws.on("close", function () {
		console.log("lost one client");
	});
});

server.listen(3300);