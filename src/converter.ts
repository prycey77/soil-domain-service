import XLSX from "xlsx";
import csv from "csvtojson";

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

  return jsonObject;
};

const csvToJson = async (s3Object: any) => {
  const jsonObject = await csv({ flatKeys: true, delimiter: "," }).fromString(
    s3Object.Body.toString()
  );

  return jsonObject;
};

export { csvToJson, xlsxToJson };
