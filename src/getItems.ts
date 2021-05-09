import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({ region: "eu-west-2" });

const getItemsFromDdb = async (event: any) => {
  const table = "eurofins-monitor-results";
  const params = {
    TableName: table,
    IndexName: "orchardId-sampleDate-index",
    ExpressionAttributeValues: {
      ":orchard_id": event.arguments.orchardId,
      ":sample_date": event.arguments.sampleDate,
    },
    KeyConditionExpression: "orchardId = :orchard_id and sampleDate = :sample_date",
  };

  const data = await ddb.query(params).promise();
  return data;
};

export { getItemsFromDdb };
