#!/bin/bash
rm -rf dist/
mkdir dist/
./tools/ico.sh
echo "{\"main\": \"main.js\"}" > dist/package.json
# cd dist
# yarn init -y
# yarn add node-machine-id
# cd -
