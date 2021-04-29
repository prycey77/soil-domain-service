import { S3Handler } from "aws-lambda";
import path from "path";
import { saveItems } from "./database";
import { getS3Object, headObject } from "./objectStore";
import { csvToJson, xlsxToJson } from "./converter";

const primaryKey: string = "Sample_description";

// eslint-disable-next-line consistent-return
const saveSoilSample: S3Handler = async (event) => {
  const { name: Bucket } = event.Records[0].s3.bucket;
  const { key: Key } = event.Records[0].s3.object;
  const maxFileSize = 500000;

  const s3Meta: any = await headObject({ Bucket, Key });

  if (s3Meta.ContentLength > maxFileSize) {
    throw new Error("file too large");
  }

  const s3Object = await getS3Object({ Bucket, Key });

  const fileName = event.Records[0].s3.object.key;
  const fileType = path.extname(fileName);

  let dataJson: any[] | Error = [];
  if (fileType === ".xlsx") {
    try {
      const xlsxData: any = await xlsxToJson(s3Object);
      dataJson = xlsxData;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
  if (fileType === ".csv") {
    try {
      dataJson = await csvToJson(s3Object);
    } catch (e) {
      return e;
    }
    if (dataJson instanceof Array) {
      const lineCount = dataJson.length;
      const bytesPerLine = s3Meta.ContentLength / lineCount;
      if (bytesPerLine > 1000) {
        throw new Error("Something looks wrong with this data");
      }
    }
  }

  try {
    if (dataJson instanceof Array) {
      if (Object.keys(dataJson[0])[0] !== primaryKey) {
        throw new Error("Incorrect primary key");
      }
    } else {
      throw new Error("Something went wrong");
    }
    await saveItems(dataJson);
    // eslint-disable-next-line no-console
    console.log("Success!");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Something went wrong. Error: ${e}`);
  }
};

export { saveSoilSample };
