import { uploadSoilSampleToDdb } from "./service";

test("Upload Soil Sample Lambda Test", () => {
  uploadSoilSampleToDdb({} as any, {} as any, () => {});
});
