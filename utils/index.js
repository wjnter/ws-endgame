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

export const getDocs = async (type, model) => await model.find({ type });

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
    const date = "Apr 27 2020";
    await Flame.deleteMany({date});
    await Gas.deleteMany({date});
    await Humidity.deleteMany({date});
    await Temperature.deleteMany({date});
  }
  // if (broadcastRegex.test(message)) {
  //   const date = "Apr 27 2020";
  //   await Flame.deleteMany({date});
  //   await Gas.deleteMany({date});
  //   await Humidity.deleteMany({date});
  //   await Temperature.deleteMany({date});
  // }
}

