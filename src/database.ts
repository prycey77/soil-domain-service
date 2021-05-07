import AWS from "aws-sdk";

const tableName = "eurofins-monitor-results";
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

export { saveItems };
