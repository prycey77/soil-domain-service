/* eslint-disable no-console */
import { S3Handler } from "aws-lambda";
import { dynamoLoader } from "./ddbLoader";
import { getS3Data } from "./getS3Object";

const uploadSoilSampleToDdb: S3Handler = async (event) => {
  const { name } = event.Records[0].s3.bucket;
  const { key } = event.Records[0].s3.object;

  const getObjparams = {
    Bucket: name,
    Key: key,
  };

  try {
    const dataJson = await getS3Data(getObjparams);
    await dynamoLoader("eurofins-monitor-results", dataJson);
    console.log("Success!");
  } catch (error) {
    console.log(`Error adding data: ${error}`);
  }
};

export { uploadSoilSampleToDdb };
