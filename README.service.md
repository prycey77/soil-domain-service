# service-title

service-description

## Packages

This project publishes 2 packages, `service-template` and `service-template-runtime`. The `service-template-runtime` contains the code which is deployed, and `service-template` contains a Pulumi component(s) which can be used to perform the deployment. This will deploy the same version of `service-template-runtime`.

## Configuration

The following environment variables can be used to configure the service:

`ENV_VAR` - Description of ENV_VAR

## Development

After cloning the repository, run `npm run init` to install dependencies and execute initial builds

## Building

A GitHub Action builds, lints, tests and publishes this service to Github Packages.
It is located here [`main.yml`](.github/workflows/main.yml)

## Deployment

service-title can be deployed by including the Pulumi component(s) in the GitOps repository for the environment you wish to deploy to.

The component can be added to that environment using this command
```sh
npm install @bx-looop/service-template
```

```typescript
import { ServiceTemplate } from "@bx-looop/service-template";

const webhook = new ServiceTemplate("service-template", {
  lambdaExcludePackages: ["@bx-looop/pulumi-components"],
  tags,
});
```

Deployed code can be updated by updating the version of the `service-template` package in the environment's `package.json`

## Issues

## Monitoring

## Team

## Dependencies