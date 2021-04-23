import { S3Handler } from "aws-lambda";
import { saveItems } from "./database";
import { getS3Object } from "./objectStore";

const primaryKey: string = "Sample_description";

const saveSoilSample: S3Handler = async (event) => {
  const { name: Bucket } = event.Records[0].s3.bucket;
  const { key: Key } = event.Records[0].s3.object;

  const dataJson: any = await getS3Object({ Bucket, Key });

  const parsedDataJson = JSON.parse(dataJson.jsonObject);

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
