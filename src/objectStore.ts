import AWS from "aws-sdk";
import csv from "csvtojson";

const s3 = new AWS.S3();

type GetObjectParams = {
  Bucket: string;
  Key: string;
};

const convertCsvToJson = async (stream: any) => {
  const dataJson = await csv({ flatKeys: true, delimiter: "," }).fromStream(stream);
  const jsonObject = JSON.stringify(dataJson);

  return { jsonObject };
};

const getS3Object = async (getObjParams: GetObjectParams) => {
  const stream = s3.getObject(getObjParams).createReadStream();
  return convertCsvToJson(stream);
};

export { getS3Object };
