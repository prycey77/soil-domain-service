/* eslint-disable import/first */
const mockGetItemsFromDdb = jest.fn();

import { Context } from "aws-lambda";
import { getService } from "./getService";

jest.mock("./getItems", () => ({
  getItemsFromDdb: mockGetItemsFromDdb,
}));
const emptyContext: Context = {} as any;

const payload = {
  Items: [
    { orchardId: "AMOS", sampleDate: "12/12/2020", randomData: "1.2", timeStamp: "1000" },
    { orchardId: "AMOS", sampleDate: "12/12/2020", randomData: "300", timeStamp: "2000" },
  ],
};

describe("get service tests", () => {
  const event = {};
  test("getItemsFromDb receives object from getService", async () => {
    mockGetItemsFromDdb.mockReturnValue(payload);
    const res = await getService(event, emptyContext, () => {});
    expect(res).toBeInstanceOf(Object);
  });
  test("newest record returned if duplicates exist", async () => {
    mockGetItemsFromDdb.mockReturnValue(payload);
    const res = await getService(event, emptyContext, () => {});
    expect(res).toEqual({
      orchardId: "AMOS",
      sampleDate: "12/12/2020",
      randomData: "300",
      timeStamp: "2000",
    });
  });
  test("returns record if only 1 exists", async () => {
    mockGetItemsFromDdb.mockReturnValue({
      Items: [
        {
          orchardId: "AMOS",
          sampleDate: "12/12/2020",
          randomData: "300",
          timeStamp: "2000",
        },
      ],
    });
    const res = await getService(event, emptyContext, () => {});
    expect(res).toEqual({
      orchardId: "AMOS",
      sampleDate: "12/12/2020",
      randomData: "300",
      timeStamp: "2000",
    });
  });
});
