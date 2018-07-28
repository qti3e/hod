#!/bin/bash
./node_modules/.bin/parcel build index.html
./tools/http.sh
