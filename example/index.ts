import {SoilDomainService} from "@bx-looop/soil-domain-service";

export = async () => {
  const tags = {"example": "this is an example"}
  const service = new SoilDomainService("example",{
    lambdaExcludePackages:[],
    tags
  });
};