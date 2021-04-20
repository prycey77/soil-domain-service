import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from ".";

describe("{service} tests", () => {
  test("handler returns 200 with message", async () => {
    const event: APIGatewayProxyEvent = { queryStringParameters: { message: "Hello" } } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("Hello");
  });
});
