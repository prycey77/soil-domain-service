/* eslint-disable no-console */
import { S3Handler } from "aws-lambda";
import { dynamoLoader } from "./ddbLoader";
import { getS3Data } from "./getS3Object";

const uploadSoilSampleToDdb: S3Handler = async (event) => {
  console.log(`This is the event: ${JSON.stringify(event)}`);
  const { name } = event.Records[0].s3.bucket;
  const { key } = event.Records[0].s3.object;

  const getObjparams = {
    Bucket: name,
    Key: key,
  };

  try {
    const dataJson = await getS3Data(getObjparams);
    console.log(`This is returned from getS3Data: ${dataJson}`);
    await dynamoLoader("eurofins-monitor-results", dataJson);
    console.log(`This is the ddb function: ${dynamoLoader("eurofins-monitor-results", dataJson)}`);
    console.log("Success!");
  } catch (error) {
    throw new Error(`Error adding data: ${error}`);
  }
};

export { uploadSoilSampleToDdb };
