import { S3Event, Context } from "aws-lambda";
import { uploadSoilSampleToDdb } from "./service";
import { dynamoLoader } from "./ddbLoader";
import { getS3Data } from "./getS3Object";

const bodyJson = require("./trigger.json");

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

jest.mock("./getS3Object");
jest.mock("./ddbLoader");

// typescript magic..
function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}

const getS3DataMock = mockFunction(getS3Data);
const dynamoLoaderMock = mockFunction(dynamoLoader);

const event: S3Event = bodyJson as any;

describe("Soil Domain service tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("DynamoDB is succesfully called", async () => {
    getS3DataMock.mockReturnValue(Promise.resolve({ test: "test" }));
    const result = await uploadSoilSampleToDdb(event, emptyContext, () => {});
    expect(dynamoLoaderMock).toBeCalled();
    expect(result).not.toStrictEqual(Error());
  });

  test("DynamoDB is unsuccesfully called", async () => {
    getS3DataMock.mockReturnValue(Promise.reject(new Error()));
    const result = await uploadSoilSampleToDdb(event, emptyContext, () => {});
    expect(dynamoLoaderMock).not.toBeCalled();
    expect(result).toStrictEqual(Error());
  });
});
