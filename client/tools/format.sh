#!/bin/bash
./node_modules/.bin/prettier --write \
  app.ts \
  main.ts \
  frame.ts \
  ipc.ts \
  dashboard.ts \
  login.ts \
  styles.scss
