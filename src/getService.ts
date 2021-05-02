import { Handler } from "aws-lambda";

import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({ region: "eu-west-2" });
const getItem = async (key: string) => {
  const params = {
    TableName: "eurofins-monitor-results",
    Key: {
      ORCHARD_KEY: key,
    },
  };
  return ddb
    .get(params)
    .promise()
    .then((res) => res.Item)
    .catch((err) => err);
};

const getService: Handler = async (event) => {
  const res: any = await getItem(event.key);
  const { fieldName } = event;
  return { [fieldName]: res[fieldName] };
};

export { getService };
