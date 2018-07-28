#!/bin/bash
./node_modules/.bin/prettier --write \
  app.ts \
  main.ts \
  frame.ts \
  rpc.ts \
  dashboard.ts \
  login.ts \
  styles.scss
