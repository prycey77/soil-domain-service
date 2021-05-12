import * as pulumi from "@pulumi/pulumi";
import { Tags } from "@pulumi/aws";
import { repository, version } from "../package.json";

export const buildTags = (tags?: Tags) => {
  const stack = pulumi.getStack();
  return {
    managed: "pulumi",
    stack,
    componentSource: repository.url,
    componentVersion: version,
    ...tags,
  };
};
