#! /bin/bash

set -e;

TAG=$1

git tag -a v$TAG -m "chore: release $TAG"

COMMIT_HASH=$(git rev-parse HEAD)

echo "Tagged with $TAG for commit $COMMIT_HASH"