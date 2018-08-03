#!/bin/bash
./node_modules/.bin/parcel build http.ts --target=node
./node_modules/.bin/parcel build worker.ts --target=node
