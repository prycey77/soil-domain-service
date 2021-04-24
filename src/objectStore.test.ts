// https://github.com/dwyl/aws-sdk-mock/issues/84

// TODO: Mock S3.getObject().createReadStream

import * as AWSMock from "aws-sdk-mock";
import * as fs from "fs";
import { getS3Object, convertCsvToJson } from "./objectStore";

// const getS3ObjectMock = jest.fn(() => {
//   return { promise: fs.createReadStream("test.csv") };
// });
// const testData =
//   '[{ "Sample_description": "test sample","data": "test data"},{"Sample_description": "test2","data": "sampledata"}]';
// const getS3Object = jest.fn(() => {
//   return fs.createReadStream("./src/test.csv");
// });

// typescript magic..
function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}

jest.mock("./objectStore");

const getS3ObjectMock = mockFunction(getS3Object);

const params = { Bucket: "testBucket", Key: "testKey" };

const promiseFn = jest.fn();

jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn(() => ({
      getObject: () => {
        return {
          promise: promiseFn(),
        };
      },
    })),
  };
});

// describe("getS3Object", () => {
//   beforeEach(() => {
//     getS3ObjectMock.mockReset();
//   });
//   test("test csv to Json conversion", async () => {
//     const stream = fs.createReadStream("./src/test.csv");
//     // eslint-disable-next-line func-names
//     await stream.on("data", function (chunk) {
//       console.log(chunk.toString());
//     });
//     convertCsvToJson(stream);
//     expect(convertCsvToJson(stream)).toEqual("{}");
//   });
// });

//     try {
//       res = await getS3Object(params);
//     } catch (e) {
//       console.log(`Error found ${e}`);
//     }
//     expect(res).toStrictEqual(testData);
//   });

//   test("error if s3 is not returning json", async () => {
//     let res;
//     promiseFn.mockReturnValue(Promise.resolve({ Body: "not Json" }));
//     try {
//       res = await getJsonObject(params);
//     } catch (e) {
//       console.log(`Error found ${e}`);
//     }
//     const err = new Error("Not Json");
//     expect(res).toEqual(err);
//   });
// });
export {};
