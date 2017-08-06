#!/usr/bin/env bash

CLI_OPTS=$@
PROJECT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd)
MODULE_DIR="$PROJECT_DIR/crafter-server"

JAR=`ls -t1 $MODULE_DIR/build/libs/*fat.jar | head -1` && \
java -jar ${JAR} ${CLI_OPTS}