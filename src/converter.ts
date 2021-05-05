import { v4 as uuidv4 } from "uuid";

const ORCHARD_ID = 0;
const PROVIDER = 4;
const SOIL_TYPE = 13;
const MOISTURE = 20;
const C_ORGANIC_SOC = 222;
const DENSITY = 247;

const NUM_HEADER_ROWS = 1;

const cleanAndConvertCsv = (csvString: any) => {
  const splitData: any[] = csvString.Body.toString().split("\n");
  const data = [];

  for (let i = NUM_HEADER_ROWS; i < splitData.length; i += 1) {
    if (splitData[i] !== undefined) {
      const row = splitData[i].split(",");
      data.push({
        id: uuidv4(),
        orchardId: row[ORCHARD_ID],
        analysisProvider: row[PROVIDER],
        sampleDate: "12/12/2020",
        soilType: row[SOIL_TYPE],
        moisture: row[MOISTURE],
        COrganicSoc: row[C_ORGANIC_SOC],
        SoilDensity: row[DENSITY],
      });
    }
  }

  return data;
};

export { cleanAndConvertCsv, NUM_HEADER_ROWS };
