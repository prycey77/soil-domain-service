/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import AWS from "aws-sdk";

const dynamoLoader = async (tableName: any, rawItems: any) => {
  const dynamo = new AWS.DynamoDB.DocumentClient();
  let position = 0;

  while (position < rawItems.length) {
    console.log(`loading ${position} to ${position + 25}`);
    const batch = rawItems.slice(position, position + 25);
    position += 25;
    const items = batch.map((rawItem: any) => ({
      PutRequest: {
        Item: rawItem,
      },
    }));

    const params = {
      RequestItems: {
        [tableName]: items,
      },
    };
    try {
      await dynamo.batchWrite(params).promise();
    } catch (err) {
      console.log(err);
      return;
    }
  }
};

export { dynamoLoader };
