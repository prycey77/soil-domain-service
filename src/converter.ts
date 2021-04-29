import XLSX from "xlsx";
import csv from "csvtojson";
import Ajv from "ajv";
import schema from "./lib/schema.json";

const ajv = new Ajv();

const validateJson = (jsonObject: any) => {
  const validate = ajv.compile(schema);
  let i = 0;
  while (i < jsonObject.length) {
    const lengthOfItem = JSON.stringify(jsonObject[i]).length;
    if (!validate(jsonObject[i]) || lengthOfItem > 1000) {
      // eslint-disable-next-line no-console
      console.log(validate.errors);
      // eslint-disable-next-line no-console
      console.log(jsonObject[i]);
      return false;
    }
    i += 1;
  }
  return true;
};

const xlsxToJson = async (s3Object: any) => {
  const workBook = XLSX.read(s3Object.Body, { type: "buffer" });
  let workSheet;

  try {
    workSheet = workBook.Sheets[workBook.SheetNames[0]];
    if (!workSheet) {
      return process.exit(3);
    }
  } catch (e) {
    return process.exit(4);
  }
  const jsonObject = XLSX.utils.sheet_to_json(workSheet);

  if (validateJson(jsonObject)) {
    return jsonObject;
  }
  return new Error("Data in incorrect format");
};

const csvToJson = async (s3Object: any) => {
  const jsonObject = await csv({
    checkType: true,
    ignoreEmpty: true,
    flatKeys: true,
    delimiter: ",",
  }).fromString(s3Object.Body.toString());

  if (validateJson(jsonObject)) {
    return jsonObject;
  }
  return new Error("Data in incorrect format");
};

export { csvToJson, xlsxToJson };
