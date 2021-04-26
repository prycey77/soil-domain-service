import { S3Handler } from "aws-lambda";
import { saveItems } from "./database";
import { convertCsvToJson, convertXlsxToJson, getS3Object } from "./objectStore";

const primaryKey: string = "Sample_description";

const saveSoilSample: S3Handler = async (event) => {
  const { name: Bucket } = event.Records[0].s3.bucket;
  const { key: Key } = event.Records[0].s3.object;
  const s3Object = await getS3Object({ Bucket, Key });

  const fileName = event.Records[0].s3.object.key;
  const fileType = fileName.split(".")[1];

  let parsedDataJson;
  if (fileType === "xlsx") {
    // eslint-disable-next-line no-console
    console.log("File is xlsx");
    const xlsxData = await convertXlsxToJson(s3Object);
    parsedDataJson = await JSON.parse(xlsxData.jsonObject);
  } else if (fileType === "csv") {
    // eslint-disable-next-line no-console
    console.log("File csv");
    const csvData = await convertCsvToJson(s3Object);
    parsedDataJson = await JSON.parse(csvData.jsonObject);
  }

  if (Object.keys(parsedDataJson[0])[0] !== primaryKey) {
    // eslint-disable-next-line no-console
    console.log("Incorrect primary key");
    return;
  }
  await saveItems(parsedDataJson);
  // eslint-disable-next-line no-console
  console.log("Success!");
};

export { saveSoilSample };
