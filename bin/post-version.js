const fs = require("fs");

const deployPackage = "package.json";

// fix up dependency for runtime package
const buffer = fs.readFileSync(deployPackage);

const json = JSON.parse(buffer.toString());
const packageName = json.name;
json.dependencies[`${packageName}-runtime`] = `${json.version}`;
json.pulumi.runtimeDependencies[`${packageName}-runtime`] = `${json.version}`;

fs.writeFileSync(deployPackage, JSON.stringify(json, null, 2));
