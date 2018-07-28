#/bin/bash
rm -rf dist/
mkdir dist/
(./node_modules/.bin/parcel watch index.html; [ "$?" -lt 2 ] && kill "$$") &
./node_modules/.bin/live-server \
  dist/
