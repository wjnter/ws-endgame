import Gas from "../models/gases.model";
import Temperature from "../models/temperatures.model";
import AvgGases from "../models/avgGases.model";
import AvgTemperatures from "../models/avgTemperatures.model";
import Timbersaw from "../models/timbersaw.model";
import Battery from "../models/battery.model";

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
}

export const getAvgValue = (doc, valueNode) =>
	doc.reduce((acc, curr) => acc + +curr[valueNode], 0) / doc.length;
