#! /bin/bash

set -e;

VERSION=$1

git commit -am "release($VERSION): release version $VERSION to npm"