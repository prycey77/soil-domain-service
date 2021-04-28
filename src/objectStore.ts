import AWS from "aws-sdk";
import XLSX from "xlsx";
import csv from "csvtojson";

const s3 = new AWS.S3();

type GetObjectParams = {
  Bucket: string;
  Key: string;
};
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

const getS3Object = async (getObjParams: GetObjectParams) => {
  const s3Object = s3.getObject(getObjParams).promise();
  return s3Object;
};

export { getS3Object, convertXlsxToJson, convertCsvToJson };
