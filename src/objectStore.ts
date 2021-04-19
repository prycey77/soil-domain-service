import AWS from "aws-sdk";

const s3 = new AWS.S3();

type GetObjectParams = {
  Bucket: string;
  Key: string;
};

const getJsonObject = async (getObjParams: GetObjectParams) => {
  const s3Data = await s3.getObject(getObjParams).promise();
  if (s3Data.Body === undefined) {
    throw new Error("S3 data body is undefined");
  }
  const dataString = s3Data.Body.toString();
  return JSON.parse(dataString);
};

export { getJsonObject };
