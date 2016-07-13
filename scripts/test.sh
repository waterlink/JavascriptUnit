#!/usr/bin/env bash

set -e

for filename in $(find test -name '*.js'); do
    node "$filename"
done