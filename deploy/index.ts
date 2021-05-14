/* eslint-disable @typescript-eslint/no-unused-vars */
import * as aws from "@pulumi/aws";
import { Runtime } from "@pulumi/aws/lambda";
import { ComponentResource, Output, ResourceOptions } from "@pulumi/pulumi";
import { Tags } from "@pulumi/aws";
import { getSoilSample, saveSoilSample } from "@bx-looop/soil-domain-service-runtime";
import { assumeRolePolicyForPrincipal, PolicyDocument, Principals } from "@pulumi/aws/iam";
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

    const indexName = "orchardId-sampleDate-index";

    const dynamoTable = new aws.dynamodb.Table(
      "soilSample",
      {
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
            name: indexName,
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
      },
      {
        parent: this,
        aliases: [{ parent: opts?.parent }],
      }
    );

    const getSoilSampleRole = new aws.iam.Role(
      "getSoilSample",
      {
        assumeRolePolicy: assumeRolePolicyForPrincipal(Principals.LambdaPrincipal),
        tags,
      },
      { parent: this }
    );

    const getSoilSamplePolicy: PolicyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["dynamodb:Query"],
          Resource: [dynamoTable.arn, dynamoTable.arn.apply((arn) => `${arn}/index/${indexName}`)],
        },
      ],
    };

    const getSoilSampleRolePolicy = new aws.iam.RolePolicy(
      "getSoilSample",
      {
        role: getSoilSampleRole,
        policy: getSoilSamplePolicy,
      },
      { parent: this }
    );

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
        role: getSoilSampleRole,
        description: `getSoilSample handler for ${name}`,
        memorySize: 128,
        runtime: Runtime.NodeJS14dX,
        tags,
        timeout: 5,
      },
      { parent: this }
    );

    const s3Bucket = new aws.s3.Bucket(
      "eurofinsData",
      {
        acl: "private",
      },
      {
        parent: this,
        aliases: [{ parent: opts?.parent }],
      }
    );

    const saveSoilSampleRole = new aws.iam.Role(
      "saveSoilSample",
      {
        assumeRolePolicy: assumeRolePolicyForPrincipal(Principals.LambdaPrincipal),
        tags,
      },
      { parent: this }
    );

    const saveSoilSamplePolicy: PolicyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["dynamodb:BatchWriteItem", "dynamodb:DescribeTable"],
          Resource: [dynamoTable.arn],
        },
        {
          Effect: "Allow",
          Action: ["s3:GetObject", "s3:HeadObject"],
          Resource: [s3Bucket.arn.apply((arn) => `${arn}/*`)],
        },
      ],
    };

    const saveSoilSampleRolePolicy = new aws.iam.RolePolicy(
      "saveSoilSample",
      {
        role: saveSoilSampleRole,
        policy: saveSoilSamplePolicy,
      },
      { parent: this }
    );

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
        role: saveSoilSampleRole,
        description: `getSoilSample handler for ${name}`,
        memorySize: 128,
        runtime: Runtime.NodeJS14dX,
        tags,
        timeout: 60,
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
