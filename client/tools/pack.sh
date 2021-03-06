#!/bin/bash
set -e
tools/build.sh
cd dist
# yarn add dotenv
mkdir node_modules
cp ../node_modules/dotenv node_modules/dotenv -r 
cd ..
./node_modules/.bin/electron-packager dist hod-hod-app --overwrite --asar \
  --platform=win32 --arch=ia32 --icon=assets/favicon.ico --prune=true \
  --out=release-builds --version-string.CompanyName=CE \
  --version-string.FileDescription=CE --version-string.ProductName="Hod Hod App"
