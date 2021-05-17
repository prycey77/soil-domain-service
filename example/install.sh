#!/usr/bin/env bash
cd ../src
npm run local:publish
cd ../deploy
npm run local:publish
cd ../example
npm run local:install

