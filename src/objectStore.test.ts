import { getJsonObject } from "./objectStore";

jest.mock("aws-sdk", () => {
  return {
    // eslint-disable-next-line no-return-assign
    S3: jest.fn(() => ({
      getObject: jest.fn(() => ({
        promise: () => Promise.resolve({ Body: '{"abc": 2}' }),
      })),
    })),
  };
});

describe("mock s3 get object call", () => {
  test("test s3 is returning data", async () => {
    const data = { abc: 2 };
    const res = await getJsonObject({ Bucket: "testBucket", Key: "testKey" });
    expect(res).toStrictEqual(data);
  });
  test("error if s3 is not returning json", async () => {
    jest.resetAllMocks();
    jest.mock("aws-sdk", () => {
      return {
        // eslint-disable-next-line no-return-assign
        S3: jest.fn(() => ({
          getObject: jest.fn(() => ({
            promise: () => Promise.resolve({ Body: "not Json" }),
          })),
        })),
      };
    });

    const res = await getJsonObject({ Bucket: "testBucket", Key: "testKey" });
    const err = new Error("Not Json");
    expect(res).toEqual(err);
  });
});
