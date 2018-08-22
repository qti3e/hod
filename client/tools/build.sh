#!/bin/bash
set -e
echo "NODE_ENV=production" > .env
./tools/mkdist.sh
./node_modules/.bin/parcel build index.html --public-url ./
./node_modules/.bin/parcel build main.ts --target=electron
mv .env dist/.env
