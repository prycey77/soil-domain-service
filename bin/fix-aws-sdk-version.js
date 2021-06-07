/* 
  Ensures the aws-sdk dependency is fixed at "^2.0.0". 
  This is required to prevent the sdk being bundled as a dependency when this package is used in a lambda function
*/
const fs = require("fs");

const buffer = fs.readFileSync("package.json");

const json = JSON.parse(buffer.toString());
const awsSdkDependency = json.dependencies["aws-sdk"];
if (awsSdkDependency && awsSdkDependency !== "^2.0.0"){
  json.dependencies["aws-sdk"] = "^2.0.0";
  fs.writeFileSync("package.json", JSON.stringify(json, null, 2));
}
