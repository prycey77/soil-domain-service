/* eslint-disable @typescript-eslint/no-unused-vars */
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Runtime } from "@pulumi/aws/lambda";
import { ComponentResource, Output, ResourceOptions } from "@pulumi/pulumi";
import { Tags } from "@pulumi/aws";
import { handler } from "@bx-looop/service-template-runtime";
import { buildTags } from "./lib";

type ServiceTemplateProps = {
  lambdaExcludePackages?: string[];
  tags?: Tags;
};

export class ServiceTemplate extends ComponentResource {
  readonly lambdaArn: Output<string>;

  readonly endpoint: Output<string>;

  constructor(name: string, args: ServiceTemplateProps, opts?: ResourceOptions) {
    super("bx:components:ServiceTemplate", name, args, opts);
    const { lambdaExcludePackages = [], tags: tagArg = {} } = args;

    const tags = buildTags(tagArg);

    // packages to exclude when serializing the function for lambda
    const extraExcludePackages = [...lambdaExcludePackages, "aws-lambda"];

    // we wrap the handler in our own function, so that when the function is serialized
    // it refers to the imported library function and does not duplicate the function body
    type CallBackParameters = Parameters<typeof handler>;

    const callbackFunction = new aws.lambda.CallbackFunction(
      "lambdaFunction",
      {
        callback: (e: CallBackParameters[0]) => {
          return handler(e);
        },
        codePathOptions: {
          extraExcludePackages,
        },
        description: `service-template handler for ${name}`,
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

    const api = new awsx.apigateway.API(
      `${name}-service-template`,
      {
        routes: [
          {
            path: "/",
            method: "GET",
            eventHandler: callbackFunction,
          },
        ],
        restApiArgs: { tags } as any,
      },
      { parent: this }
    );
    this.lambdaArn = callbackFunction.arn;
    this.endpoint = api.stage.invokeUrl;
    this.registerOutputs();
  }
}
