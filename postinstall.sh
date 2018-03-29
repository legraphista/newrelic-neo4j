#!/usr/bin/env bash

# Create plugin config dir, if it doesn't exist
[[ ! -d /etc/newrelic ]] &&  mkdir /etc/newrelic

# Copy new distribution config into place
cp -f ./config.js /etc/newrelic/newrelic-neo4j.js.dist

# If no config is already in place, create from dist config
[[ ! -f /etc/newrelic/newrelic-neo4j.js ]] && cp /etc/newrelic/newrelic-neo4j.js{.dist,}

exit 0
