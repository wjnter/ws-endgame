import Flame from "../models/flames.model";
import Humidity from "../models/humidities.model";
import Gas from "../models/gases.model";
import Temperature from "../models/temperatures.model";
import AvgGases from "../models/avgGases.model";
import AvgTemperatures from "../models/avgTemperatures.model";

const handleGetType = async ({ typeName, type, value, date, time }) => {
	const docsType = new typeName({ type, value, date, time });
	await docsType.save();
};

export const createDoc = async ({ type, value, date, time }) => {
	const getTypes = {
		// "flame": () =>  handleGetType({typeName: Flame, type, value, date, time}),
		// "humidity": () => handleGetType({typeName: Humidity, type, value, date, time}),
		gas: () => handleGetType({ typeName: Gas, type, value, date, time }),
		temperature: () =>
			handleGetType({ typeName: Temperature, type, value, date, time }),
		avgGas: () =>
			handleGetType({ typeName: AvgGases, type, value, date, time }),
		avgTemperature: () =>
			handleGetType({ typeName: AvgTemperatures, type, value, date, time }),
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
export const getAllDocs = async model =>
	await model.find({ });

export const CONSTANT_TYPE = [
	{ type: "temperature", model: Temperature },
	{ type: "gas", model: Gas },
	{ type: "avgTemperature", model: AvgTemperatures },
	{ type: "avgGas", model: AvgGases },
];

// export const CONSTANT_TYPE_AVG = [
// 	{ type: "avgTemperature", model: AvgTemperatures },
// 	{ type: "avgGas", model: AvgGases },
// ];

// export const CONSTANT_TYPE = [
//   { type: "flame",       model: Flame },
//   { type: "gas",         model: Gas },
//   { type: "humidity",    model: Humidity },
//   { type: "temperature", model: Temperature }
// ];

export function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export const clearAllDocs = async (message) => {
	// const broadcastRegex = /^delete/;
	if (message.includes("delete")) {
		const date = "May 27 2020";
		await Gas.deleteMany({ date });
		await Temperature.deleteMany({ date });
		// await Flame.deleteMany({date});
		// await Humidity.deleteMany({date});
	}
};

export const clearAllDocsWithDate = async (date) => {
	await Gas.deleteMany({ date });
	await Temperature.deleteMany({ date });
	// const broadcastRegex = /^delete/;
	// await Flame.deleteMany({date});
	// await Humidity.deleteMany({date});
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
