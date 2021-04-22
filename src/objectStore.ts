import AWS from "aws-sdk";
import csv from "csvtojson";

const s3 = new AWS.S3();

type GetObjectParams = {
  Bucket: string;
  Key: string;
};

// eslint-disable-next-line consistent-return
const getS3Object = async (getObjParams: GetObjectParams) => {
  const s3Data: any = s3.getObject(getObjParams).createReadStream();
  const dataJson = await csv({ flatKeys: true, delimiter: "," }).fromStream(s3Data);
  console.log(`stringify datajson ${JSON.stringify(dataJson)}`);

  const data = JSON.stringify(dataJson);

  return { data };
};

export { getS3Object };
