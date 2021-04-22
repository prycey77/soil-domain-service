import { getJsonObject } from "./objectStore";

const testData = {
  Sample_description: "YOUNGM26S 18738",
  Material: "BODEM",
  OmTypeMonster: "Loess",
  DtMonster: "8102020",
};
jest.mock("aws-sdk", () => {
  return {
    // eslint-disable-next-line no-return-assign
    S3: jest.fn(() => ({
      getObject: jest.fn(() => ({
        promise: () =>
          Promise.resolve({
            Body: JSON.stringify(testData),
          }),
      })),
    })),
  };
});

describe("mock s3 get object call", () => {
  test("test s3 is returning data", async () => {
    // const data = { abc: 2 };
    const res = await getJsonObject({ Bucket: "testBucket", Key: "testKey" });
    // console.log(Object.keys(res)[0]);
    expect(res).toStrictEqual(testData);
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
