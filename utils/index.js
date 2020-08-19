import Gas from "../models/gases.model";
import Temperature from "../models/temperatures.model";
import AvgGases from "../models/avgGases.model";
import AvgTemperatures from "../models/avgTemperatures.model";
import Timbersaw from "../models/timbersaw.model";
import Battery from "../models/battery.model";
const fetch = require("node-fetch");

const handleGetType = async ({
	typeName,
	type,
	valueNode1,
	valueNode2,
	date,
	time,
}) => {
	const docsType = new typeName({ type, valueNode1, valueNode2, date, time });
	await docsType.save();
};

export const createDoc = async ({
	type,
	valueNode1,
	valueNode2,
	date,
	time,
}) => {
	const getTypes = {
		gas: () =>
			handleGetType({
				typeName: Gas,
				type,
				valueNode1,
				valueNode2,
				date,
				time,
			}),
		temperature: () =>
			handleGetType({
				typeName: Temperature,
				type,
				valueNode1,
				valueNode2,
				date,
				time,
			}),
		battery: () =>
			handleGetType({
				typeName: Battery,
				type,
				valueNode1,
				valueNode2,
				date,
				time,
			}),
		timbersaw: () =>
			handleGetType({
				typeName: Timbersaw,
				type,
				valueNode1,
				valueNode2,
				date,
				time,
			}),
		avgGas: () =>
			handleGetType({
				typeName: AvgGases,
				type,
				valueNode1,
				valueNode2,
				date,
				time,
			}),
		avgTemperature: () =>
			handleGetType({
				typeName: AvgTemperatures,
				type,
				valueNode1,
				valueNode2,
				date,
				time,
			}),
	};
	getTypes[type]();
};

export const createDocs = (message, createDoc) => {
	const docs = JSON.parse(message);
	docs.map(createDoc);
};

export const getDocsWithDate = async (date, model) =>
	await model.find({ date });
export const getDocsWithTime = async (time, model) =>
	await model.find({ time });
export const getAllDocs = async (model) => await model.find({});

export const CONSTANT_TYPE = [
	{ type: "temperature", model: Temperature },
	{ type: "gas", model: Gas },
	{ type: "timbersaw", model: Timbersaw },
	{ type: "battery", model: Battery },
	{ type: "avgTemperature", model: AvgTemperatures },
	{ type: "avgGas", model: AvgGases },
];

export function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export const clearAllDocsWithDate = async (date) => {
	await Gas.deleteMany({ date });
	await Temperature.deleteMany({ date });
	await Battery.deleteMany({ date });
	await Timbersaw.deleteMany({ date });
};

export const getCurrentTimeAndDate = (identifier) => {
	const date = new Date().toString().split(" ");
	const currentDate = date.slice(1, 4).join(" ");
	const currentTime = date[4];
	const arrTime = currentTime.split(":");
	const currentTimeWithHourAndMin = `${arrTime[0]}:${arrTime[1]}`;
	if (identifier === "date") return currentDate;
	if (identifier === "wholeTime") return currentTime;
	if (identifier === "hourAndMin") return currentTimeWithHourAndMin;
};

export const getAvgValue = (doc, valueNode) =>
	doc.reduce((acc, curr) => acc + +curr[valueNode], 0) / doc.length;

const tokenNotification = "ExponentPushToken[pug8SfIShcNnZF9kKpocfV]";

export const FUNCTION_ALERT = {
	timbersaw: async (value1, value2) => {
		value1 && (await sendPushNotification("saw", "1", tokenNotification));
		value2 && (await sendPushNotification("saw", "2", tokenNotification));
	},
	gas: async (value1, value2) => {
		value1 > 25 && (await sendPushNotification("burn", "1", tokenNotification));
		value2 > 25 && (await sendPushNotification("burn", "2", tokenNotification));
	},
	temperature: async (value1, value2) => {
		value1 > 50 && (await sendPushNotification("burn", "1", tokenNotification));
		value2 > 50 && (await sendPushNotification("burn", "2", tokenNotification));
	},
	battery: (value1, value2) => console.log("sad"),
};

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
export async function sendPushNotification(type, node, expoPushToken) {
	const message = {
		burn: {
			to: expoPushToken,
			sound: "default",
			title: `Nguy hiểm! Cháy tại Trạm ${node}`,
			body: "Đang phát hiện nhiệt độ bất thường!!",
			data: { data: "goes here" },
		},
		saw: {
			to: expoPushToken,
			sound: "default",
			title: `Nguy hiểm! Trộm gỗ tại Trạm ${node}`,
			body: "Đang phát hiện hiện tượng trộm gỗ",
			data: { data: "goes here" },
		},
	};

	await fetch("https://exp.host/--/api/v2/push/send", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Accept-encoding": "gzip, deflate",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(message[type]),
	});
}
