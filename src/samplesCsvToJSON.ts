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
        uploadTimeStamp: Date.now(),
        orchardKey: rows[constants.ORCHARD_ID],
        sampleDate: constants.SAMPLE_DATE,
        analysisProvider: rows[constants.PROVIDER],
        soilType: rows[constants.SOIL_TYPE],
        bemDiepteHg: rows[constants.BEM_DIEPTE_HG],
        moisture: rows[constants.MOISTURE],
        nitrogenStock: rows[constants.NITROGEN_STOCK],
        carbonNitrogenRatio: rows[constants.CARBON_NITROGEN_RATIO],
        nitrogenSupplyingCapacity: rows[constants.NITROGEN_SUPPLYING_CAPACITY],
        phosphorusStock: rows[constants.PHOSPHOURS_STOCK],
        kSoilStock: rows[constants.K_SOIL_STOCK],
        sulphurStock: rows[constants.SULPHUR_STOCK],
        sulphurSupplyingCapacity: rows[constants.SULPHUR_SUPPLYING_CAPACITY],
        saanv: rows[constants.SAANV],
        ph: rows[constants.PH],
        carbonateLime: rows[constants.CARBONATE_LIME],
        organicMatter: rows[constants.ORGANIC_MATTER],
        clay: rows[constants.CLAY],
        clayHumusCec: rows[constants.CLAY_HUMUS_SEC],
        cecSaturation: rows[constants.CEC_SATURATION],
        microbialActivity: rows[constants.MICROBIAL_ACTIVITY],
        csRatio: rows[constants.CS_RATIO],
        caSoilStockMmolKg: rows[constants.CA_SOIL_STOCK_MMOL_KG],
        mgSoilStock: rows[constants.MG_SOIL_STOCK],
        naSoilStock: rows[constants.NA_SOIL_STOCK],
        hSaturation: rows[constants.H_SATURATION],
        alSaturation: rows[constants.AL_SATURATION],
        soilCrumblingScore: rows[constants.SOIL_CRUMBLING_SCORE],
        soilSlakingScore: rows[constants.SOIL_SLAKING_SCORE],
        mediumVaulueSandFraction: rows[constants.MED_VALUE_SAND_FRACTION],
        caSaturation: rows[constants.CA_SATURATION],
        mgSaturation: rows[constants.MG_SATURATION],
        kSaturation: rows[constants.K_SATURATION],
        naSaturation: rows[constants.NA_SATURATION],
        phCaCi: rows[constants.PH_CA_CI],
        caSoilStockKgCaHa: rows[constants.CA_SOIL_STOCK_KG_CA_HA],
        soilOrganicContent: rows[constants.SOIL_ORGANIC_CONTENT],
        cOsRatio: rows[constants.C_OS_RATIO],
        silt: rows[constants.SILT],
        sand: rows[constants.SAND],
        pfFieldCapacity: rows[constants.PF_FIELD_CAPACITY],
        pfWiltingPoint: rows[constants.PF_WILTING_POINT],
        soilDensity: rows[constants.SOIL_DENSITY],
      });
    }
  }
  return data;
};

export { cleanAndConvertCsv, NUM_HEADER_ROWS };
