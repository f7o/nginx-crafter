#!/usr/bin/env bash

PROJECT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )
cd "$PROJECT_DIR"

./gradlew crafter-client:yarn_build
./gradlew crafter-server:build
./gradlew crafter-server:shadowJar
