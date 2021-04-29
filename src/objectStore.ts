import AWS from "aws-sdk";

const s3 = new AWS.S3();

type GetObjectParams = {
  Bucket: string;
  Key: string;
};

// eslint-disable-next-line consistent-return
const getJsonObject = async (getObjParams: GetObjectParams) => {
  try {
    const s3Data: any = await s3.getObject(getObjParams).promise();
    if (s3Data.Body === undefined) {
      throw new Error("S3 data body is undefined");
    }
    const dataString = s3Data.Body.toString();
    const json = JSON.parse(dataString);
    return json;
  } catch (err) {
    return new Error("Not Json");
  }
};

export { getJsonObject };
