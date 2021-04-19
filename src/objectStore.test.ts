jest.mock("aws-sdk", () => {
  return {
    // eslint-disable-next-line no-return-assign
    S3: jest.fn(() => ({
      getObject: jest.fn(() => ({
        promise: () => Promise.resolve({ Body: '{ "sample":"test", "soc":30 }' }),
      })),
    })),
  };
});

// eslint-disable-next-line import/first
import { getJsonObject } from "./objectStore";

describe("mock s3 get object call", () => {
  test("", async () => {
    const data = { sample: "test", soc: 30 };
    const res = await getJsonObject({ Bucket: "testBucket", Key: "testKey" });
    expect(res).toStrictEqual(data);
  });
});
