import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const message = event.queryStringParameters?.message || "OK";
  return {
    statusCode: 200,
    body: message!,
  };
};
