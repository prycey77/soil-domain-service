#! /bin/bash

# Get dependencies installed after cloning the repo
npm install
cd src
npm install
npm run build
cd ../deploy
npm install
npm run build