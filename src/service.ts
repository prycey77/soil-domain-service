import { S3Handler } from "aws-lambda";
import { saveItems } from "./database";
import { getJsonObject } from "./objectStore";

const saveSoilSample: S3Handler = async (event) => {
  const { name: Bucket } = event.Records[0].s3.bucket;
  const { key: Key } = event.Records[0].s3.object;

  const dataJson = await getJsonObject({ Bucket, Key });
  await saveItems(dataJson);
  // eslint-disable-next-line no-console
  console.log("Success!");
};

export { saveSoilSample };
