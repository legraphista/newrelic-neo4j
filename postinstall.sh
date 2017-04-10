#!/usr/bin/env bash

mkdir /etc/newrelic;
# don't overwrite the previous file
cp -n ./config.js /etc/newrelic/newrelic-neo4j.js

exit 0;