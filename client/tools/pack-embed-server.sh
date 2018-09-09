#!/bin/bash
set -e
tools/build.sh
cp ../server/node_modules dist -r
cp package-embed.json dist/package.json
./node_modules/.bin/electron-packager dist hod-hod-app --overwrite \
  --platform=win32 --arch=ia32 --icon=assets/favicon.ico --prune=true \
  --out=release-builds --version-string.CompanyName=CE \
  --version-string.FileDescription=CE --version-string.ProductName="Hod Hod App"
