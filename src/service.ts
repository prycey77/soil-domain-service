/* eslint-disable no-console */
import { S3Handler } from "aws-lambda";
import AWS from "aws-sdk";
import { dynamoLoader } from "./ddbLoader";

const s3 = new AWS.S3();

const uploadSoilSampleToDdb: S3Handler = async (event) => {
  const { name } = event.Records[0].s3.bucket;
  const { key } = event.Records[0].s3.object;

  const getObjparams = {
    Bucket: name,
    Key: key,
  };

  try {
    const s3Data = await s3.getObject(getObjparams).promise();
    if (s3Data.Body === undefined) {
      throw new Error("S3 data body is undefined");
    }
    const dataString = s3Data.Body.toString();
    const dataJson = JSON.parse(dataString);
    console.log(`Data:::${dataString}`);

    await dynamoLoader("eurofins-monitor-results", dataJson);
  } catch (error) {
    throw new Error("Error adding data");
  }
};

export { uploadSoilSampleToDdb };
