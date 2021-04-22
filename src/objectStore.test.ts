import { getJsonObject } from "./objectStore";

const testData = {
  Sample_description: "YOUNGM26S 18738",
  Material: "BODEM",
  OmTypeMonster: "Loess",
  DtMonster: "8102020",
};

const params = { Bucket: "testBucket", Key: "testKey" };
const promiseFn = jest.fn();

jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn(() => ({
      getObject: () => {
        return {
          promise: promiseFn,
        };
      },
    })),
  };
});

describe("mock s3 get object call", () => {
  beforeEach(() => {
    promiseFn.mockReset();
  });
  test("test s3 is returning data", async () => {
    let res;
    promiseFn.mockReturnValue(Promise.resolve({ Body: JSON.stringify(testData) }));

    try {
      res = await getJsonObject(params);
    } catch (e) {
      console.log(`Error found ${e}`);
    }
    expect(res).toStrictEqual(testData);
  });

  test("error if s3 is not returning json", async () => {
    let res;
    promiseFn.mockReturnValue(Promise.resolve({ Body: "not Json" }));
    try {
      res = await getJsonObject(params);
    } catch (e) {
      console.log(`Error found ${e}`);
    }
    const err = new Error("Not Json");
    expect(res).toEqual(err);
  });
});
