import { Context } from "aws-lambda";
import { getService } from "./getService";

const emptyContext: Context = {} as any;

const payload = {
  Items: [
    { orchardId: "AMOS", sampleDate: "12/12/2020", randomData: "1.2", timeStamp: "1000" },
    { orchardId: "AMOS", sampleDate: "12/12/2020", randomData: "300", timeStamp: "2000" },
  ],
};
jest.mock("./getItems", () => {
  return {
    getItemsFromDdb: () => {
      return payload;
    },
  };
});

describe("get service tests", () => {
  const event = {};
  test("getItemsFromDb receives object from getService", async () => {
    const res = await getService(event, emptyContext, () => {});
    expect(res).toBeInstanceOf(Object);
  });
  test("newest record returned if duplicates", async () => {
    const res = await getService(event, emptyContext, () => {});
    expect(res).toEqual({
      orchardId: "AMOS",
      sampleDate: "12/12/2020",
      randomData: "300",
      timeStamp: "2000",
    });
  });
});
