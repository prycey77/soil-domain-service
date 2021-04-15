import AWS from "aws-sdk";

const s3 = new AWS.S3();

const getS3Data = async (getObjparams: AWS.S3.GetObjectRequest) => {
  const s3Data = await s3.getObject(getObjparams).promise();
  if (s3Data.Body === undefined) {
    throw new Error("S3 data body is undefined");
  }
  const dataString = s3Data.Body.toString();
  const dataJson = JSON.parse(dataString);
  return dataJson;
};
export { getS3Data };
