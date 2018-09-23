#/bin/bash
./tools/mkdist.sh
(./node_modules/.bin/parcel watch index.html; [ "$?" -lt 2 ] && kill "$$") &
(./node_modules/.bin/parcel watch main.ts --target=electron; [ "$?" -lt 2 ] && kill "$$") &
./node_modules/.bin/http-server -c-1 \
  dist/
