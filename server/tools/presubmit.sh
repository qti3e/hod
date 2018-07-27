#!/bin/bash
set -e
./tools/lint.sh
./tools/tsc.sh
./tools/test.sh
