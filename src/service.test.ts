import { Context } from "aws-lambda";
import { saveSoilSample } from "./service";
import { saveItems } from "./database";
import { getS3Object, headObject } from "./objectStore";
import { xlsxToJson, csvToJson } from "./converter";
import { event } from "./lib/triggerTemplate";
import { headResponse } from "./lib/headResponseTemplate";
// jest.mock("aws-sdk");

// typescript magic..
function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}

const emptyContext: Context = {} as any;

jest.mock("./objectStore");
jest.mock("./converter");
jest.mock("./database");
// const headResponse = {
//   "x-amz-id-2": "ef8yU9AS1ed4OpIszj7UDNEHGran",
//   "x-amz-request-id": "318BC8BC143432E5",
//   "x-amz-version-id": "3HL4kqtJlcpXroDTDmjVBH40Nrjfkd",
//   Date: "Wed, 28 Oct 2009 22:32:00 GMT",
//   "Last-Modified": "Sun, 1 Jan 2006 12:00:00 GMT",
//   ETag: "fba9dede5f27731c9771645a39863328",
//   "Content-Length": 434234,
//   "Content-Type": "text/plain",
//   Connection: "close",
//   Server: "AmazonS3",
// };

const getS3ObjectMock = mockFunction(getS3Object);
const saveItemsMock = mockFunction(saveItems);
const convertXlsxToJsonMock: any = mockFunction(xlsxToJson);
const convertCsvToJsonMock: any = mockFunction(csvToJson);
const headObjectMock: any = mockFunction(headObject);

describe("Soil Domain service tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    headObjectMock.mockReturnValue(Promise.resolve(headResponse(90000)));
  });
  test("Database is called on save with xlsx", async () => {
    convertXlsxToJsonMock.mockReturnValue(
      Promise.resolve([
        { Sample_description: "test sample", data: "test data" },
        { Sample_description: "test2", data: "sampledata" },
      ])
    );
    await saveSoilSample(event("test.xlsx"), emptyContext, () => {});
    expect(convertXlsxToJsonMock).toBeCalled();
    expect(getS3ObjectMock).toBeCalled();
    expect(saveItemsMock).toBeCalled();
  });
  test("Database is called on save with csv", async () => {
    convertCsvToJsonMock.mockReturnValue(
      Promise.resolve([
        { Sample_description: "test sample", data: "test data" },
        { Sample_description: "test2", data: "sampledata" },
      ])
    );
    await saveSoilSample(event("test.csv"), emptyContext, () => {});
    expect(convertCsvToJsonMock).toBeCalled();
    expect(getS3ObjectMock).toBeCalled();
    expect(saveItemsMock).toBeCalled();
  });

  test("Throws error on Database error", async () => {
    const databaseError = new Error("database");
    let thrownError = new Error("something");
    getS3ObjectMock.mockReturnValue(Promise.reject(databaseError));
    try {
      await saveSoilSample(event("test.csv"), emptyContext, () => {});
    } catch (error) {
      thrownError = error;
    }
    expect(saveItemsMock).not.toBeCalled();
    expect(thrownError).toBe(databaseError);
  });
  test("Database not called if primary key is incorrect", async () => {
    convertXlsxToJsonMock.mockReturnValue(
      Promise.resolve({ jsonObject: '[{ "IncorrectPrimaryKey": "test"}]' })
    );
    await saveSoilSample(event("test.xlsx"), emptyContext, () => {});
    expect(getS3ObjectMock).toBeCalled();
    expect(saveItemsMock).not.toBeCalled();
  });
  test("saveSoilSample called with incorrect filetype", async () => {
    await saveSoilSample(event("test.txt"), emptyContext, () => {});
    expect(getS3ObjectMock).toBeCalled();
    expect(saveItemsMock).not.toBeCalled();
  });
  test("throws error if file is too large", async () => {
    headObjectMock.mockReturnValue(await Promise.resolve(headResponse(9000000)));
    const fileError = new Error("file too large");
    let thrownError = new Error("something");
    try {
      await saveSoilSample(event("test.csv"), emptyContext, () => {});
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toStrictEqual(fileError);
  });
});

export {};
