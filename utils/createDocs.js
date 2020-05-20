import Flame from "../models/flames.model";
import Gas from "../models/gases.model";
import Humidity from "../models/humidities.model";
import Temperature from "../models/temperatures.model";

const handleGetType = async ({typeName, type, value, date, time}) => {
  const docsType = new typeName({type, value, date, time});
  await docsType.save();
}

const createDocs = async ({ type, value, date, time }) => {
  const getTypes = {
    "flame": () => handleGetType({typeName: Flame, type, value, date, time}),
    "humidity": () =>  handleGetType({typeName: Humidity, type, value, date, time}),
    "gas": () => handleGetType({typeName: Gas, type, value, date, time}),
    "temperature": () => handleGetType({typeName: Temperature, type, value, date, time}),
  }
  getTypes[type];
}

export default createDocs;