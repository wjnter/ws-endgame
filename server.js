/**************************websocket_example.js*************************************************/

var bodyParser = require("body-parser");
const express = require("express"); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
var http = require("http");
const mongoose = require("mongoose");

import AvgTemperatures from "./models/avgTemperatures.model";
import AvgGases from "./models/avgGases.model";

import {
	createDocs,
	createDoc,
	IsJsonString,
	getDocsWithDate,
	getDocsWithTime,
	CONSTANT_TYPE,
	clearAllDocsWithDate,
	getAllDocs,
	getAvgValue,
	getCurrentTimeAndDate,
	sendPushNotification,
	FUNCTION_ALERT,
} from "./utils";

const userName = "tptdong97";
const password = "admin";
const dbName = "endgame_ute";

const uri = `mongodb+srv://${userName}:${password}@cluster0-krug7.mongodb.net/${dbName}?retryWrites=true&w=majority`;
// const uri = "mongodb://localhost/end-game";
const port = process.env.PORT || 3300;

mongoose
	.connect(process.env.MONGODB_URI || uri)
	.catch((err) => console.log("err here::::", err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app); //create a server

//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require("dns").lookup(require("os").hostname(), function (err, add, fam) {
	console.log("addr: " + add);
});

/*-------------------------------websocket setup----------------------------------*/
//var expressWs = require('express-ws')(app,server);
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server });

app.get("/", (req, res) => {
	res.send("hello");
});
/*-------------------------------ws chat server----------------------------------*/

wss.on("connection", async (ws, req) => {
	const dataset = [];
	// const currentFullDate = "May 31 2020";
	let currentFullDate = "";
	// let currentFullDate = "Jul 10 2020";
	// RegExp time to query docs
	const currentTimeWithHourAndMin = getCurrentTimeAndDate("hourAndMin");
	// currentTimeWithHourAndMin: ---  /14:15/i
	const regExpTime = new RegExp(currentTimeWithHourAndMin, "i");

	// use for..of, since map or forEach cannot do async
	for (const item of CONSTANT_TYPE) {
		const { type, model } = item;
		// Get all docs at current time within a min
		if (!type.includes("avgTemperature") && !type.includes("avgGas")) {
			const doc = await getDocsWithTime(regExpTime, model);
			dataset.push(doc.slice(-1)[0]);
		}
	}

	// Send the last document to the client that has been connected
	ws.send(JSON.stringify(dataset));

	ws.on("open", function open() {
		console.log("client connected");
	});

	/******* when server receives message from client trigger function with argument message *****/
	ws.on("message", async (message) => {
		console.log("data received: ", message);
		let avgDailyDataset = [];
		let newMessage = "";
		const currentDate = getCurrentTimeAndDate("date");
		const currentTime = getCurrentTimeAndDate("wholeTime");
		// const currentDate = "May 31 2020";
		// const isNewDate = currentFullDate !== "Jul 09 2020";
		const isNewDate = currentFullDate !== currentDate;
		if (isNewDate && currentFullDate !== "") {
			let dataOfPreviousDate = [];
			for (const item of CONSTANT_TYPE) {
				const { type, model } = item;
				let doc;
				// Get all docs at the previous day
				if (!type.includes("avgTemperature") && !type.includes("avgGas")) {
					doc = await getDocsWithDate(currentFullDate, model);
					if (doc.length) {
						const { type, valueNode1, valueNode2, date, time } = doc[1];
						let newAvgDocs = { type, valueNode1, valueNode2, date, time };
						// Compute the average value to create new docs
						const avgValueNode1 = getAvgValue(doc, "valueNode1");
						const avgValueNode2 = getAvgValue(doc, "valueNode2");
						newAvgDocs.valueNode1 = "" + Math.round(avgValueNode1);
						newAvgDocs.valueNode2 = "" + Math.round(avgValueNode2);
						newAvgDocs.type =
							"avg" +
							newAvgDocs.type[0].toUpperCase() +
							newAvgDocs.type.slice(1);
						dataOfPreviousDate.push(newAvgDocs);
					}
				}
			}
			await createDocs(JSON.stringify(dataOfPreviousDate), createDoc);
			dataOfPreviousDate.length = 0;
			// Clear all docs of the previous day
			await clearAllDocsWithDate(currentFullDate);

			currentFullDate = currentDate;
		}
		if (isNewDate) currentFullDate = currentDate;

		const isJson = IsJsonString(message);
		if (isJson) {
			// type of objMessage is Array
			const objMessage = JSON.parse(message);
			// Set interval for nodes
			if (objMessage[0] === "interval") {
				console.log("ok la");
			} else {
				// Check danger value for pushing notification
				for (const { type, valueNode1, valueNode2 } of objMessage) {
					await FUNCTION_ALERT[type](valueNode1, valueNode2);
				}
				// set time to store
				objMessage.forEach((obj) => {
					obj.date = currentDate;
					obj.time = currentTime;
				});
				newMessage = JSON.stringify(objMessage);
				createDocs(newMessage, createDoc);
			}
		} else {
			await clearAllDocsWithDate(message);
		}

		if (message === "getAvgData") {
			for (const item of CONSTANT_TYPE) {
				const { type, model } = item;
				if (
					(type.includes("avgTemperature") && model === AvgTemperatures) ||
					(type.includes("avgGas") && model === AvgGases)
				) {
					const avgDoc = await getAllDocs(model);
					avgDailyDataset.push(...avgDoc);
				}
			}
			ws.send(JSON.stringify([message, avgDailyDataset]));
			avgDailyDataset.length = 0;
		} else if (message.includes("interval")) {
			wss.clients.forEach((client) => {
				// Send all clients including sender.
				client.readyState && isJson && client.send(message);
			});
		} else {
			// console.log("Received: " + message);
			wss.clients.forEach((client) => {
				// Send all clients including sender.
				client.readyState && isJson && client.send(newMessage);
			});
		}
	});
	ws.on("close", () => {
		console.log("lost one client");
	});
});

server.listen(port, () => {
	console.log("Listening at port: ", port);
});
