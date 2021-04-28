import fs from "fs";
import { isJsonObject } from "./lib/jsonHelper";

import { convertXlsxToJson, convertCsvToJson } from "./converter";

const dummyData = (file: fs.PathLike) => {
  try {
    const data = fs.readFileSync(file);
    return data;
  } catch (err) {
    return err;
  }
};
describe("convertXlsxToJson", () => {
  test("S3 object is converted to json from xlsx", async () => {
    const data = await dummyData("./src/lib/test.xlsx");
    const res: any = await convertXlsxToJson({ Body: data });
    const resIsJson = isJsonObject(res);
    expect(resIsJson).toEqual(true);
  });
  test("error thrown if S3 object is not xlsx", async () => {
    const data = await dummyData("./src/lib/test.txt");
    const res: any = await convertXlsxToJson({ Body: data });
    const resIsJson = isJsonObject(res);
    expect(resIsJson).toEqual(false);
  });
});
describe("converCsvToJson", () => {
  test("S3 object is converted to json from csv", async () => {
    const data = await dummyData("./src/lib/test.csv");
    const res: any = await convertCsvToJson({ Body: data });
    const resIsJson = isJsonObject(res);
    expect(resIsJson).toEqual(true);
    expect(res[0].Sample_description).toEqual("25ACRBLACK");
  });
});
