/* eslint-disable import/first */

const mockGetItems = jest.fn();
const mockSaveItems = jest.fn();

import { saveSoilSample, getSoilSample } from "./service";
import { getS3Object, headObject } from "./objectStore";
import { cleanAndConvertCsv } from "./samplesCsvToJSON";
import { event } from "./lib/triggerTemplate";
import { headResponse } from "./lib/headResponseTemplate";

// typescript magic..
function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}

jest.mock("./objectStore");
jest.mock("./samplesCsvToJSON");
jest.mock("./database", () => ({
  getItems: mockGetItems,
  saveItems: mockSaveItems,
}));

const getS3ObjectMock = mockFunction(getS3Object);
const cleanAndConvertCsvMock: any = mockFunction(cleanAndConvertCsv);
const headObjectMock: any = mockFunction(headObject);

describe("Soil Domain service tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    headObjectMock.mockReturnValue(Promise.resolve(headResponse(1000)));
  });
  test("throws error if file is too large", async () => {
    headObjectMock.mockReturnValue(await Promise.resolve(headResponse(9000000)));
    const fileError = new Error("file too large");
    let thrownError = new Error("something");
    try {
      await saveSoilSample(event("test.csv"));
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toStrictEqual(fileError);
  });
  test("saveSoilSample called with incorrect filetype", async () => {
    await saveSoilSample(event("test.txt"));
    expect(getS3ObjectMock).toBeCalled();
    expect(mockSaveItems).not.toBeCalled();
  });
  test("Throws error on Database error", async () => {
    const databaseError = new Error("database");
    let thrownError = new Error("something");
    getS3ObjectMock.mockReturnValue(Promise.reject(databaseError));
    try {
      await saveSoilSample(event("test.csv"));
    } catch (error) {
      thrownError = error;
    }
    expect(mockSaveItems).not.toBeCalled();
    expect(thrownError).toBe(databaseError);
  });
  test("cleanAndConvertCsv is called on .csv event", async () => {
    await saveSoilSample(event("test.csv"));
    expect(cleanAndConvertCsvMock).toBeCalled();
  });
  test("Database is called on save with csv", async () => {
    cleanAndConvertCsvMock.mockReturnValue([
      { id: "345435345", data: "test data" },
      { id: "523423434", data: "sampledata" },
    ]);
    await saveSoilSample(event("test.csv"));
    expect(cleanAndConvertCsvMock).toBeCalled();
    expect(getS3ObjectMock).toBeCalled();
    expect(mockSaveItems).toBeCalled();
  });

  test("throws error bytes per line is too large", async () => {
    headObjectMock.mockReturnValue(await Promise.resolve(headResponse(500000)));
    cleanAndConvertCsvMock.mockReturnValue([
      { id: "345435345", data: "test data" },
      { id: "523423434", data: "sampledata" },
    ]);
    const dataError = new Error("Something looks wrong with this data");
    let thrownError = new Error("something");
    try {
      await saveSoilSample(event("test.csv"));
    } catch (error) {
      thrownError = error;
    }
    expect(mockSaveItems).not.toBeCalled();
    expect(thrownError).toStrictEqual(dataError);
  });
});

const payload = {
  Items: [
    { orchardId: "AMOS", sampleDate: "12/12/2020", randomData: "1.2", timeStamp: "1000" },
    { orchardId: "AMOS", sampleDate: "12/12/2020", randomData: "300", timeStamp: "2000" },
  ],
};

describe("get soil data tests", () => {
  const testEvent = {};
  test("getItems receives object from getSoilSample", async () => {
    mockGetItems.mockReturnValue(payload);
    const res = await getSoilSample(event);
    expect(res).toBeInstanceOf(Object);
  });
  test("newest record returned if duplicates exist", async () => {
    mockGetItems.mockReturnValue(payload);
    const res = await getSoilSample(testEvent);
    expect(res).toEqual({
      orchardId: "AMOS",
      sampleDate: "12/12/2020",
      randomData: "300",
      timeStamp: "2000",
    });
  });
  test("returns record if only 1 exists", async () => {
    mockGetItems.mockReturnValue({
      Items: [
        {
          orchardId: "AMOS",
          sampleDate: "12/12/2020",
          randomData: "300",
          timeStamp: "2000",
        },
      ],
    });
    const res = await getSoilSample(event);
    expect(res).toEqual({
      orchardId: "AMOS",
      sampleDate: "12/12/2020",
      randomData: "300",
      timeStamp: "2000",
    });
  });
  test("returns error if no results are found", async () => {
    mockGetItems.mockReturnValue({
      Items: [],
    });
    const getDataError = new Error("Data not defined");
    let thrownError = new Error("something");
    try {
      await getSoilSample(event);
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).toStrictEqual(getDataError);
  });
});

export {};
