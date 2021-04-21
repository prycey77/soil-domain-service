# Service Repository Template

A template for LOOOP service repositories.

## Usage

First, configure the files using the provided interactive helper script:

```
npm run init-template
```

You can then `git commit` and `git push` and begin using the repository normally.

## Repository Structure

Here is a list of all directories and files contained in this repository and brief descriptions of what they are for:

- [`.github/workflows`](.github/workflows) &mdash; defines the GitHub actions for the repository.
- [`.vscode/settings.json`](.vscode/settings.json) &mdash; defines the rules used by Visual Studio Code when editing files in this repository.
- [`src/`](src/) &mdash; contains the source TypeScript files (including tests).
- [`deploy/`](deploy/) &mdash; folder containing Pulumi component(s) that deploy the code to the cloud and create associated resources which the service owns. This may include API Gateways, S3 Buckets, App Sync APIs or DynamoDB Tables.
- [`.eslintignore`](.eslintignore) &mdash; lists the files and directories that should be ignored by ESLint.
- [`.eslintrc.json`](.eslintrc.json) &mdash; defines the rules used by ESLint for linting.
- [`.gitignore`](.gitignore) &mdash; lists the files and directories that should be ignored and not committed by Git.
- [`.prettierignore`](.gitignore) &mdash; lists the files and directories that should be ignored by the Prettier plugin for ESLint.
- [`.prettierrc.js`](.prettierrc.js) &mdash; defines the rules used by the Prettier plugin for ESLint.
- [`README.md`](README.md) &mdash; contains written information about the repository, including how to run and deploy any contained code.
- [`package.json`](package.json), [`src/package.json`](src/package.json), [`deploy/package.json`](deploy/package.json)  &mdash; lists the minimum version of the project dependencies. Also defines the project description, author and license information, and the scripts to run via `npm`.
- [`src/tsconfig.json`](src/tsconfig.json), [`deploy/tsconfig.json`](deploy/tsconfig.json) &mdash; specifies the compiler options used when compiling the TypeScript code in the repository.

## Main Dependencies

- [TypeScript](https://www.npmjs.com/package/typescript) &mdash; used for adding static typing to JavaScript.
- [Jest](https://www.npmjs.com/package/jest) &mdash; used for testing (or more specifically, [ts-jest](https://www.npmjs.com/package/ts-jest)).
- [ESLint](https://www.npmjs.com/package/eslint) &mdash; used for linting.

## GitHub Actions

A GitHub Action builds, lints, tests and publishes this service to Github Packages.
It is located here [`main.yml`](.github/workflows/main.yml)