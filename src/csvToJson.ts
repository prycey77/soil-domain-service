import csv = require("csvtojson");

const filepath = "./test.csv";

csv()
  .fromFile(filepath)
  .then((jsonObj: any) => {
    console.log(jsonObj);
  });
