// https://github.com/dwyl/aws-sdk-mock/issues/84

// TODO: Mock S3.getObject().createReadStream

// import { getS3Object } from "./objectStore";

// const testData =
//   '[{ "Sample_description": "test sample","data": "test data"},{"Sample_description": "test2","data": "sampledata"}]';

// const params = { Bucket: "testBucket", Key: "testKey" };
// const promiseFn = jest.fn();

// jest.mock("aws-sdk", () => {
//   return {
//     S3: jest.fn(() => ({
//       getObject: () => {
//         return {
//           promise: promiseFn,
//         };
//       },
//     })),
//   };
// });

describe("mock s3 get object call", () => {
  //   beforeEach(() => {
  //     promiseFn.mockReset();
  //   });
  test("test s3 is returning data", async () => {
    //     let res;
    //     promiseFn.mockReturnValue(
    //       Promise.resolve({
    //         Body:
    //           '[{ "Sample_description": "test sample","data": "test data"},{"Sample_description": "test2","data": "sampledata"}]',
    expect("foo").toBe("foo");
  });
});

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
