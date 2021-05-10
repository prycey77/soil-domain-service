import { S3Handler, Handler } from "aws-lambda";
import path from "path";
import { saveItems, getItems } from "./database";
import { getS3Object, headObject } from "./objectStore";
import { cleanAndConvertCsv } from "./converter";

const maxFileSize = 500000;
const primaryKey: string = "id";

// eslint-disable-next-line consistent-return
const saveSoilSample: S3Handler = async (event) => {
  const { name: Bucket } = event.Records[0].s3.bucket;
  const { key: Key } = event.Records[0].s3.object;

  const s3Meta: any = await headObject({ Bucket, Key });

  if (s3Meta.ContentLength > maxFileSize) {
    throw new Error("file too large");
  }

  const s3Object = await getS3Object({ Bucket, Key });
  const fileName = event.Records[0].s3.object.key;
  const fileType = path.extname(fileName);

  const validateJson = (data: any) => {
    if (data instanceof Array) {
      const lineCount = data.length;
      const bytesPerLine = s3Meta.ContentLength / lineCount;
      if (bytesPerLine > 1000) {
        throw new Error("Something looks wrong with this data");
      }
    }
    return true;
  };
  let dataJson;
  if (fileType === ".csv") {
    try {
      dataJson = cleanAndConvertCsv(s3Object);
    } catch (e) {
      return e;
    }
    validateJson(dataJson);
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

const getSoilSample: Handler = async (event: any) => {
  let data: any;
  try {
    data = await getItems(event);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  if (!data) {
    throw new Error("Data not defined");
  }
  let item;
  if (data.Items.length > 1) {
    item = data.Items.reduce((prev: any, current: any) =>
      +prev.timeStamp > +current.timeStamp ? prev : current
    );
  } else {
    [item] = data.Items;
  }

  return item;
};

export { saveSoilSample, getSoilSample };
