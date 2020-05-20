/**************************websocket_example.js*************************************************/

var bodyParser = require("body-parser");
const express = require("express"); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
var http = require("http");
var path = require("path");
const mongoose = require("mongoose");


import Flame from "./models/flames.model";
import Gas from "./models/gases.model";
import Humidity from "./models/humidities.model";
import Temperature from "./models/temperatures.model";

import { 
	createDocs, 
	createDoc, 
	IsJsonString, 
	clearAllDocs, 
	getDocs,
	CONSTANT_TYPE
} 
from "./utils/index";


mongoose.connect("mongodb://localhost/end-game");



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
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

//when browser sends get request, send html file to browser
// viewed at http://localhost:3300
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/index.html"));
});

/*-------------------------------ws chat server----------------------------------*/

//app.ws('/echo', function(ws, req) {
wss.on("connection", async (ws, req) => {
	let dataset = [];
	for (const item of CONSTANT_TYPE) {
		const { type, model } = item;
		const doc = await getDocs(type, model);
		dataset.push(doc.slice(-1)[0]);
	}

	console.log(":dataset", dataset);
	// Send the last document to the client that has been connected
	ws.send(JSON.stringify(dataset));

	/******* when server receives messsage from client trigger function with argument message *****/
	ws.on("message", async message => {		
		const isJson = IsJsonString(message);
		
		isJson ? createDocs(message, createDoc) : await clearAllDocs(message);

		console.log("Received: " + message);
		wss.clients.forEach(client => {
			// Send all clients including sender.
			client.readyState && client.send( message );
		});
	});
	ws.on("close", () => {
		console.log("lost one client");
	});

});

server.listen(3300);
