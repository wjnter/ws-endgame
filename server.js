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
	clearAllDocs,
	getDocsWithDate,
	getDocsWithTime,
	CONSTANT_TYPE,
	getCurrentDate,
	getCurrentTime,
	clearAllDocsWithDate,
	getAllDocs,
} from "./utils";

const userName = "tptdong97";
const password = "admin";
const dbName = "endgame_ute";

const uri = `mongodb+srv://${userName}:${password}@endgame-ute-3eiy7.mongodb.net/${dbName}?retryWrites=true&w=majority`;
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
	const timeNow = getCurrentTime();
	let currentFullDate = "";
	// RegExp time to query docs
	const regExpTime = new RegExp(timeNow, "i");

	// use for..of bcuz map or forEach cannot do async
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

	/******* when server receives messsage from client trigger function with argument message *****/
	ws.on("message", async (message) => {
		// Get current hour and min to generate regexp to query
		let avgDailyDataset = [];
		// const fullDateNow = "May 31 2020";
		const fullDateNow = getCurrentDate();
		const isNewDate = currentFullDate !== fullDateNow;

		if (isNewDate && currentFullDate !== "") {
			let dataOfPreviousDate = [];
			for (const item of CONSTANT_TYPE) {
				const { type, model } = item;
				let doc;
				// Get all docs at the previous day
				if (!type.includes("avgTemperature") && !type.includes("avgGas")) {
					doc = await getDocsWithDate(currentFullDate, model);
					if (doc.length) {
						const { type, value, date, time } = doc[1];
						let newAvgDocs = { type, value, date, time };
						// Compute the average value to create new docs
						const avgValue =
							doc.reduce((acc, curr) => acc + +curr.value, 0) / doc.length;
						newAvgDocs.type =
							"avg" +
							newAvgDocs.type[0].toUpperCase() +
							newAvgDocs.type.slice(1);
						newAvgDocs.value = "" + Math.round(avgValue);
						dataOfPreviousDate.push(newAvgDocs);
					}
				}
			}
			await createDocs(JSON.stringify(dataOfPreviousDate), createDoc);
			dataOfPreviousDate.length = 0;
			// Clear all docs of the previous day
			await clearAllDocsWithDate(currentFullDate);

			currentFullDate = fullDateNow;
		}

		const isJson = IsJsonString(message);

		isJson ? createDocs(message, createDoc) : await clearAllDocs(message);

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
			ws.send(JSON.stringify(["getAvgData", avgDailyDataset]));
			avgDailyDataset.length = 0;
		}

		// console.log("Received: " + message);
		wss.clients.forEach((client) => {
			// Send all clients including sender.
			client.readyState && isJson && client.send(message);
		});
	});
	ws.on("close", () => {
		console.log("lost one client");
	});
});

server.listen(port, () => {
	console.log("Listening at port: ", port);
});
