/* eslint-disable @typescript-eslint/no-unused-vars */
import * as aws from "@pulumi/aws";
import { Runtime } from "@pulumi/aws/lambda";
import { ComponentResource, Output, ResourceOptions } from "@pulumi/pulumi";
import { Tags } from "@pulumi/aws";
import { getSoilSample, saveSoilSample } from "@bx-looop/soil-domain-service-runtime";
import { buildTags } from "./lib";

type SoilDomainServiceProps = {
  lambdaExcludePackages?: string[];
  tags?: Tags;
};

export class SoilDomainService extends ComponentResource {
  readonly lambdaArn: Output<string>;

  readonly bucketName: Output<string>;

  readonly tableName: Output<string>;

  constructor(name: string, args: SoilDomainServiceProps, opts?: ResourceOptions) {
    super("bx:components:SoilDomainService", name, args, opts);
    const { lambdaExcludePackages = [], tags: tagArg = {} } = args;

    const tags = buildTags(tagArg);

    // packages to exclude when serializing the function for lambda
    const extraExcludePackages = [...lambdaExcludePackages, "aws-lambda"];

    // we wrap the handler in our own function, so that when the function is serialized
    // it refers to the imported library function and does not duplicate the function body
    type CallBackParameters = Parameters<typeof getSoilSample>;

    const dynamoTable = new aws.dynamodb.Table("soilSample", {
      attributes: [
        {
          name: "id",
          type: "S",
        },
        {
          name: "orchardId",
          type: "S",
        },
        {
          name: "sampleDate",
          type: "S",
        },
      ],
      billingMode: "PROVISIONED",
      globalSecondaryIndexes: [
        {
          hashKey: "orchardId",
          name: "orchardId-sampleDate-index",
          nonKeyAttributes: ["id"],
          projectionType: "INCLUDE",
          rangeKey: "sampleDate",
          readCapacity: 2,
          writeCapacity: 2,
        },
      ],
      hashKey: "id",
      rangeKey: "orchardId",
      readCapacity: 2,
      tags: {},
      writeCapacity: 2,
    });

    const getSoilSampleLambda = new aws.lambda.CallbackFunction(
      "getSoilSample",
      {
        callback: (e: CallBackParameters[0]) => {
          return getSoilSample(e);
        },
        codePathOptions: {
          extraExcludePackages,
        },
        environment: {
          variables: {
            SOIL_SAMPLE_TABLE: dynamoTable.name,
          },
        },
        description: `getSoilSample handler for ${name}`,
        memorySize: 128,
        runtime: Runtime.NodeJS14dX,
        tags,
        timeout: 5,
      },
      { parent: this }
    );

    const s3Bucket = new aws.s3.Bucket("eurofinsData", {
      acl: "private",
    });

    const saveSoilSampleLambda = new aws.lambda.CallbackFunction(
      "saveSoilSample",
      {
        callback: (e: CallBackParameters[0]) => {
          return saveSoilSample(e);
        },
        codePathOptions: {
          extraExcludePackages,
        },
        environment: {
          variables: {
            SOIL_SAMPLE_TABLE: dynamoTable.name,
          },
        },
        description: `getSoilSample handler for ${name}`,
        memorySize: 128,
        runtime: Runtime.NodeJS14dX,
        tags,
        timeout: 5,
      },
      { parent: this }
    );

    s3Bucket.onObjectCreated("s3ObjectCreated", saveSoilSampleLambda);

    this.bucketName = s3Bucket.bucket;
    this.tableName = dynamoTable.name;
    this.lambdaArn = getSoilSampleLambda.arn;
    this.registerOutputs();
  }
}
