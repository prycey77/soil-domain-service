import { S3Event } from "aws-lambda";
import { uploadSoilSampleToDdb } from "./service";
import { dynamoLoader } from "./ddbLoader";
import { getS3Data } from "./getS3Object";

// typescript magic..
jest.mock("./getS3Object");
jest.mock("./ddbLoader");

const body = Buffer.from(JSON.stringify(bodyJson)).toString("base64");

function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}

const dynamoLoaderMock = mockFunction(dynamoLoader);
const getS3DataMock = mockFunction(getS3Data);

// getS3DataMock.mockImplementation;
test("Upload Soil Sample Lambda Test", () => {
  const event = {} as any;

  const result = await uploadSoilSampleToDdb(event, {}, null);
});
