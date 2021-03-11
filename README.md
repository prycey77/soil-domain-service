# Service Repository Template

A template for LOOOP service repositories.

## Repository Structure

Here is a list of all directories and files contained in this repository and brief descriptions of what they are for:

- [`.github/workflows`](.github/workflows) &mdash; defines the GitHub actions for the repository.
- [`.vscode/settings.json`](.vscode/settings.json) &mdash; defines the rules used by Visual Studio Code when editing files in this repository.
- [`src/`](src/) &mdash; contains the source TypeScript files (including tests).
- [`.eslintignore`](.eslintignore) &mdash; lists the files and directories that should be ignored by ESLint.
- [`.eslintrc.json`](.eslintrc.json) &mdash; defines the rules used by ESLint for linting.
- [`.gitignore`](.gitignore) &mdash; lists the files and directories that should be ignored and not committed by Git.
- [`.prettierignore`](.gitignore) &mdash; lists the files and directories that should be ignored by the Prettier plugin for ESLint.
- [`.prettierrc.js`](.prettierrc.js) &mdash; defines the rules used by the Prettier plugin for ESLint.
- [`README.md`](README.md) &mdash; contains written information about the repository, including how to run and deploy any contained code.
- [`package-lock.json`](package-lock.json) &mdash; lists the exact versions of the dependencies defined in [`package.json`](package.json) that should be installed when running `npm install`.
- [`package.json`](package.json) &mdash; lists the minimum version of the project dependencies. Also defines the project description, author and license information, and the scripts to run via `npm`.
- [`tsconfig.json`](tsconfig.json) &mdash; specifies the compiler options used when compiling the TypeScript code in the repository.
- [`webpack.config.json`](webpack.config.json) &mdash; specifies the configuration options used for Webpack.

## Main Dependencies

- [TypeScript](https://www.npmjs.com/package/typescript) &mdash; used for adding static typing to JavaScript.
- [Jest](https://www.npmjs.com/package/jest) &mdash; used for testing (or more specifically, [ts-jest](https://www.npmjs.com/package/ts-jest)).
- [ESLint](https://www.npmjs.com/package/eslint) &mdash; used for linting.