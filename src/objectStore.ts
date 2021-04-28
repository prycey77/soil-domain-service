import AWS from "aws-sdk";

const s3 = new AWS.S3();

type GetObjectParams = {
  Bucket: string;
  Key: string;
};

const getS3Object = async (getObjParams: GetObjectParams) => {
  const s3Object = s3.getObject(getObjParams).promise();
  return s3Object;
};

export { getS3Object };
