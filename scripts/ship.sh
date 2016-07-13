#!/usr/bin/env bash

set -e

git pull --rebase
./scripts/test.sh
git push