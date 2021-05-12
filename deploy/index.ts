/* eslint-disable @typescript-eslint/no-unused-vars */
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Runtime } from "@pulumi/aws/lambda";
import { ComponentResource, Output, ResourceOptions } from "@pulumi/pulumi";
import { Tags } from "@pulumi/aws";
import { getSoilSample } from "@bx-looop/soil-domain-service-runtime";
import { buildTags } from "./lib";

type SoilSampleServiceProps = {
  lambdaExcludePackages?: string[];
  tags?: Tags;
};

export class SoilSampleService extends ComponentResource {
  readonly lambdaArn: Output<string>;

  constructor(name: string, args: SoilSampleServiceProps, opts?: ResourceOptions) {
    super("bx:components:SoilSampleService", name, args, opts);
    const { lambdaExcludePackages = [], tags: tagArg = {} } = args;

    const tags = buildTags(tagArg);

    // packages to exclude when serializing the function for lambda
    const extraExcludePackages = [...lambdaExcludePackages, "aws-lambda"];

    // we wrap the handler in our own function, so that when the function is serialized
    // it refers to the imported library function and does not duplicate the function body
    type CallBackParameters = Parameters<typeof getSoilSample>;

    const callbackFunction = new aws.lambda.CallbackFunction(
      "lambdaFunction",
      {
        callback: (e: CallBackParameters[0]) => {
          return getSoilSample(e);
        },
        codePathOptions: {
          extraExcludePackages,
        },
        description: `getSoilSample handler for ${name}`,
        environment: {
          variables: {
            VAR_1: "value",
          },
        },
        memorySize: 128,
        runtime: Runtime.NodeJS12dX,
        tags,
        timeout: 5,
      },
      { parent: this }
    );

    this.lambdaArn = callbackFunction.arn;
    this.registerOutputs();
  }
}
