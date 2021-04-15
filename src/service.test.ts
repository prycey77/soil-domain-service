import { S3Event, Context } from "aws-lambda";
import { uploadSoilSampleToDdb } from "./service";
import { dynamoLoader } from "./ddbLoader";
import { getS3Data } from "./getS3Object";

const bodyJson = require("./trigger.json");
// typescript magic..
jest.mock("./getS3Object");
jest.mock("./ddbLoader");

const emptyContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "",
  functionVersion: "",
  invokedFunctionArn: "",
  memoryLimitInMB: "",
  awsRequestId: "",
  logGroupName: "",
  logStreamName: "",
  getRemainingTimeInMillis: () => 1,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}

const getS3DataMock = mockFunction(getS3Data);
const dynamoLoaderMock = mockFunction(dynamoLoader);
const event: S3Event = bodyJson as any;

test("DynamoDB is succesfully called", async () => {
  getS3DataMock.mockReturnValue(Promise.resolve({ test: "test" }));
  await uploadSoilSampleToDdb(event, emptyContext, () => {});
  expect(dynamoLoaderMock).toBeCalled();
});

test("DynamoDB is unsuccesfully called", async () => {
  jest.resetAllMocks();
  getS3DataMock.mockReturnValue(Promise.reject(new Error()));
  await uploadSoilSampleToDdb(event, emptyContext, () => {});
  expect(dynamoLoaderMock).not.toBeCalled();
});
