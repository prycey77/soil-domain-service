import { S3Event, Context } from "aws-lambda";
import bodyJson from "./trigger.json";
import { uploadSoilSampleToDdb } from "./service";
import { dynamoLoader } from "./ddbLoader";
import { getS3Data } from "./getS3Object";

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

const body = JSON.parse(bodyJson);

const getS3DataMock = mockFunction(getS3Data);
const dynamoLoaderMock = mockFunction(dynamoLoader);

// getS3DataMock.mockImplementation;
test("Upload Soil Sample Lambda Test", async () => {
  const event: S3Event = { body } as any;
  getS3DataMock.mockReturnValue(Promise.resolve({ test: "test" }));
  const response = await uploadSoilSampleToDdb(event, emptyContext, () => {});
  expect(dynamoLoaderMock).toBeCalledTimes(1);
});
