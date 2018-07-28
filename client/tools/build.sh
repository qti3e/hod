#!/bin/bash
./node_modules/.bin/parcel build index.html
./node_modules/.bin/parcel build main.ts --target=electron
./tools/http.sh
