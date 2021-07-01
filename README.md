# Soil Domain Service

Populates a DynamoDB table with soil sample data when a .csv file is uploaded to S3

## Development
After cloning the repository, run `npm run init` to install dependencies and execute initial builds

#### Local Packages

The `deploy` package references the output of the `src` folder using a relative file reference.

If you wish to run the example locally, it is necessary to build the packages with locally resolved references. Verdaccio can be used as a local package repository, and npmrc to manage npmrc files.

`npm i -g verdaccio npmrc`

Run `verdaccio` in the console.

Create a new npmrc npmrc:

`npmrc -c verdaccio` and then run `npm set registry http://localhost:4873/`

Login to the repository using `npm login`. Packages will now be resolved through the local repository and we can publish it.

in the `src` folder, run `npm run local:publish` to publish the `soil-domain-service` package.

In the `deploy` folder, run `npm run local:publish` to install the package as a dependency and publish the `soil-domain-service` package.

This package can now be installed in the `example` folder using `npm run local:install`.

The package can now be tested using `pulumi up` (with AWS credentials in the shell)

You can see packages installed in verdaccio at http://localhost:4873/

NOTE - you can restore your previous npmrc file (needed to access github packages) by running `npmrc default`

A GitHub Action builds, lints, tests and publishes this service to Github Packages.
