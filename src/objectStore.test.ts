import fs from "fs";
import { isJson } from "./lib/jsonHelper";

import { convertXlsxToJson } from "./objectStore";

const dummyData = (file: fs.PathLike) => {
  try {
    const data = fs.readFileSync(file);
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};
describe("convertXlsxToJson", () => {
  test("S3 object is converted to json", async () => {
    const data = await dummyData("./src/lib/test.xlsx");
    const res = await convertXlsxToJson({ Body: data });
    const resIsJson = isJson(res.jsonObject);
    expect(resIsJson).toEqual(true);
  });
  test("error thrown if S3 object is not xlsx", async () => {
    const data = await dummyData("./src/lib/test.txt");
    const res = await convertXlsxToJson({ Body: data });
    const resIsJson = isJson(res.jsonObject);
    expect(resIsJson).toEqual(false);
  });
});
