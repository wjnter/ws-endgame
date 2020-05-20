import Flame from "../models/flames.model";
import Gas from "../models/gases.model";
import Humidity from "../models/humidities.model";
import Temperature from "../models/temperatures.model";

const handleGetType = async ({typeName, type, value, date, time}) => {
  const docsType = new typeName({type, value, date, time});
  await docsType.save();
}

export const createDoc = async ({ type, value, date, time }) => {
  const getTypes = {
    "flame": () =>  handleGetType({typeName: Flame, type, value, date, time}),
    "humidity": () => handleGetType({typeName: Humidity, type, value, date, time}),
    "gas": () => handleGetType({typeName: Gas, type, value, date, time}),
    "temperature": () => handleGetType({typeName: Temperature, type, value, date, time}),
  }
  getTypes[type]();
}

export const createDocs = (message, createDoc) => {
  const docs = JSON.parse(message);
  docs.map(createDoc);
}

export const getDocs = async ( regExpTime, model ) => await model.find({ time: regExpTime });

export const CONSTANT_TYPE = [
  {
    type: "flame",
    model: Flame 
  },
  {
    type: "gas",
    model: Gas 
  },
  {
    type: "humidity",
    model: Humidity
  },
  {
    type: "temperature",
    model: Temperature
  }
];

export function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const clearAllDocs = async message => {
  // const broadcastRegex = /^delete/;
  if (message.includes('delete')) {
    const date = "May 05 2020";
    await Flame.deleteMany({date});
    await Gas.deleteMany({date});
    await Humidity.deleteMany({date});
    await Temperature.deleteMany({date});
  }
}

export const clearAllDocsWithDate = async date => {
  // const broadcastRegex = /^delete/;
    await Flame.deleteMany({date});
    await Gas.deleteMany({date});
    await Humidity.deleteMany({date});
    await Temperature.deleteMany({date});
}


export const getCurrentDate = _ => {
  const fullDate = new Date();
  const CONSTANT_MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = fullDate.getFullYear();
  const month = fullDate.getMonth();
  const date = fullDate.getDate();

  return `${CONSTANT_MONTH[month]} ${date} ${year}`;
}

export const getCurrentTime = _ => {
  const currentTime = new Date();
  const hour = currentTime.getHours();
	const min = currentTime.getMinutes();
	return `${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}`;
}
