#!/bin/bash
set -e
tools/build.sh
./node_modules/.bin/electron-packager . hod-hod-app --overwrite --asar=true \
  --platform=win32 --arch=ia32 --icon=assets/favicon.ico --prune=true \
  --out=release-builds --version-string.CompanyName=CE \
  --version-string.FileDescription=CE --version-string.ProductName="Hod Hod App"
