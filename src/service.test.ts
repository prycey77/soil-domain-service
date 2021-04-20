import { Context } from "aws-lambda";
import { saveSoilSample } from "./service";
import { saveItems } from "./database";
import { getJsonObject } from "./objectStore";

import event from "./trigger.json";

// typescript magic..
function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}

const emptyContext: Context = {} as any;

jest.mock("./objectStore");
jest.mock("./database");
jest.mock("aws-sdk");

const getJsonObjectMock = mockFunction(getJsonObject);
const saveItemsMock = mockFunction(saveItems);

describe("Soil Domain service tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Database is called on save", async () => {
    getJsonObjectMock.mockReturnValue(Promise.resolve({ test: "test" }));
    await saveSoilSample(event, emptyContext, () => {});
    expect(getJsonObjectMock).toBeCalled();
    expect(saveItemsMock).toBeCalled();
  });

  test("Throws error on Database error", async () => {
    const databaseError = new Error("database");
    let thrownError = new Error("something");
    getJsonObjectMock.mockReturnValue(Promise.reject(databaseError));
    try {
      await saveSoilSample(event, emptyContext, () => {});
    } catch (error) {
      thrownError = error;
    }
    expect(saveItemsMock).not.toBeCalled();
    expect(thrownError).toBe(databaseError);
  });
});

// TODO tests for S3 object not existing, not being valid JSON, not being the format we expect
