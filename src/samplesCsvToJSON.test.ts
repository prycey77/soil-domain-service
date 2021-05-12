import fs from "fs";
import { isJsonObject } from "./lib/jsonHelper";

import { cleanAndConvertCsv, NUM_HEADER_ROWS } from "./samplesCsvToJSON";

const dummyData = (file: fs.PathLike) => {
  try {
    const data = fs.readFileSync(file);
    return data;
  } catch (err) {
    return err;
  }
};

describe("converCsvToJson", () => {
  test("S3 object is converted to json from csv", async () => {
    const data = await dummyData("./lib/Eurofins_with_OrchardID.csv");
    const res: any = await cleanAndConvertCsv({ Body: data });
    const resIsJson = isJsonObject(res);
    expect(resIsJson).toEqual(true);
    expect(res[0].orchardId).toEqual("25ACRBLACK");
  });
  test("returns the correct number of items", async () => {
    const data = await dummyData("./lib/Eurofins_with_OrchardID.csv");
    const res: any = await cleanAndConvertCsv({ Body: data });

    const numberOfLines = data.toString().split("\n").length - NUM_HEADER_ROWS;

    expect(res.length).toEqual(numberOfLines);
  });
});
