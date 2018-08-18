#!/bin/bash
ts=$(find . -maxdepth 1 -name "*.ts" -not -name "cities.data.ts")
./node_modules/.bin/prettier --write $ts *.json *.scss
