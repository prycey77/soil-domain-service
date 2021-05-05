import AWS from "aws-sdk";

const s3 = new AWS.S3();

type GetObjectParams = {
  Bucket: string;
  Key: string;
};

const getS3Object = async (getObjParams: GetObjectParams) => s3.getObject(getObjParams).promise();

const headObject = async (getObjParams: GetObjectParams) => s3.headObject(getObjParams).promise();

export { getS3Object, headObject };
