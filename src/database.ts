import AWS from "aws-sdk";

export const tableName = process.env.SOIL_SAMPLE_TABLE || "eurofins-monitor-results";
const dynamo = new AWS.DynamoDB.DocumentClient();
// if (typeof process.env.TABLE_NAME === "undefined") {
//   throw new Error("Table name is not defined");
// }
// const tableName: string = process.env.TABLE_NAME;

const saveItems = async (rawItems: any) => {
  let position = 0;
  while (position < rawItems.length) {
    // eslint-disable-next-line no-console
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
      // it may be better to collect all the promises here and then do a Promise.all at the end.
      // eslint-disable-next-line no-await-in-loop
      await dynamo.batchWrite(params).promise();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      return;
    }
  }
};

const getItems = async (event: any) => {
  const params = {
    TableName: tableName,
    IndexName: "orchardId-sampleDate-index",
    ExpressionAttributeValues: {
      ":orchard_id": event.arguments.orchardId,
      ":sample_date": event.arguments.sampleDate,
    },
    KeyConditionExpression: "orchardId = :orchard_id and sampleDate = :sample_date",
  };

  const data = await dynamo.query(params).promise();
  return data;
};

export { saveItems, getItems };
