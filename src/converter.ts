import { v4 as uuidv4 } from "uuid";
import * as constants from "./lib/constants";

const NUM_HEADER_ROWS = 1;

const cleanAndConvertCsv = (csvString: any) => {
  const splitData: any[] = csvString.Body.toString().split("\n");
  const data = [];

  for (let i = NUM_HEADER_ROWS; i < splitData.length; i += 1) {
    if (splitData[i] !== undefined) {
      const rows = splitData[i].split(",");
      data.push({
        id: uuidv4(),
        orchardId: rows[constants.ORCHARD_ID],
        uploadTimeStamp: Date.now(),
        nitrogenSupplyingCapacity: rows[constants.NITROGEN_SUPPLYING_CAPACITY],
        ph: rows[constants.PH],
        carbonateLime: rows[constants.CARBONATE_LIME],
        organicMatter: rows[constants.ORGANIC_MATTER],
        microbialAvtivity: rows[constants.MICROBIAL_ACTIVITY],
        analysisProvider: rows[constants.PROVIDER],
        sampleDate: "01/01/2021",
        soilType: rows[constants.SOIL_TYPE],
        moisture: rows[constants.MOISTURE],
        soilOrganicContent: rows[constants.SOIL_ORGANIC_CONTENT],
        soilDensity: rows[constants.SOIL_DENSITY],
      });
    }
  }
  return data;
};

export { cleanAndConvertCsv, NUM_HEADER_ROWS };
