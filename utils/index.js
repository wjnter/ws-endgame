import Gas from "../models/gases.model";
import Temperature from "../models/temperatures.model";
import AvgGases from "../models/avgGases.model";
import AvgTemperatures from "../models/avgTemperatures.model";

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

export const clearAllDocs = async (date) => {
	await Gas.deleteMany({ date });
	await Temperature.deleteMany({ date });
};

export const clearAllDocsWithDate = async (date) => {
	await Gas.deleteMany({ date });
	await Temperature.deleteMany({ date });
};

export const getCurrentDate = (_) => {
	const fullDate = new Date();
	const CONSTANT_MONTH = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const year = fullDate.getFullYear();
	const month = fullDate.getMonth();
	const date = fullDate.getDate();

	return `${CONSTANT_MONTH[month]} ${date} ${year}`;
};

export const getCurrentTime = (_) => {
	const currentTime = new Date();
	const hour = currentTime.getHours();
	const min = currentTime.getMinutes();

	return `${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}`;
};

export const getAvgValue = (doc, valueNode) =>
	doc.reduce((acc, curr) => acc + +curr[valueNode], 0) / doc.length;
