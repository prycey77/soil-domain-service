import { Handler } from "aws-lambda";

import AWS from "aws-sdk";

AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB.DocumentClient();

const getService: Handler = async () => {
  console.log("Hello getService");

  const params = {
    TableName: "eurofins-monitor-results",
    Key: {
      ORCHARD_KEY: "AMOS",
    },
  };
  console.log(ddb, params);
  await ddb
    .get(params)
    .promise()
    .then((data) => console.log(data.Item))
    .catch(console.error);
};

export { getService };
