import XLSX from "xlsx";
import csv from "csvtojson";

const convertXlsxToJson = async (s3Object: any) => {
  const workBook = XLSX.read(s3Object.Body, { type: "buffer" });
  let workSheet;
  // const targetSheet = "Sheet1";
  try {
    workSheet = workBook.Sheets[workBook.SheetNames[0]];
    if (!workSheet) {
      return process.exit(3);
    }
  } catch (e) {
    return process.exit(4);
  }
  const jsonObject = JSON.stringify(XLSX.utils.sheet_to_json(workSheet));

  return { jsonObject };
};

const convertCsvToJson = async (s3Object: any) => {
  const dataJson = await csv({ flatKeys: true, delimiter: "," }).fromString(
    s3Object.Body.toString()
  );
  const jsonObject = JSON.stringify(dataJson);

  return { jsonObject };
};

export { convertCsvToJson, convertXlsxToJson };
