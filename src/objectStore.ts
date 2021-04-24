import AWS from "aws-sdk";
import XLSX from "xlsx";

const s3 = new AWS.S3();

type GetObjectParams = {
  Bucket: string;
  Key: string;
};
const convertXlsxToJson = async (stream: any) => {
  console.log(`stream::: ${JSON.stringify(stream)} `);
  console.log(`stream.Body.data::: ${stream.Body} `);

  const wb = XLSX.read(stream.Body, { type: "buffer" });
  let ws;
  const targetSheet = "Sheet1";
  try {
    console.log("converting xlsx");
    ws = wb.Sheets[targetSheet];
    if (!ws) {
      console.error(`Sheet ${targetSheet} cannot be found`);
      process.exit(3);
    }
  } catch (e) {
    console.log(e);
    process.exit(4);
  }
  const jsonObject = JSON.stringify(XLSX.utils.sheet_to_json(ws));
  return { jsonObject };
};

// const xxx = async (stream: any) => {
//   const dataJson = await csv({ flatKeys: true, delimiter: "," }).fromStream(stream);
//   const jsonObject = JSON.stringify(dataJson);

//   return { jsonObject };
// };

const getS3Object = async (getObjParams: GetObjectParams) => {
  const stream = s3.getObject(getObjParams).promise();
  return stream;
};

export { getS3Object, convertXlsxToJson };
