# newrelic-neo4j

_Neo4j performance monitor plugin for Newrelic_

![Overview](https://cloud.githubusercontent.com/assets/962643/14102149/811abb98-f5a1-11e5-83f9-9530ac764b36.png)
____

## Description

The plugin monitors various metrics of your Neo4J database
like hits, transactions, storage and cache.

___

## Requirements

- Neo4j Enterprise (Community edition also works but only reports database size)
- NodeJS 4+

___

## Installation

***NodeJS***

There are a number of ways to install node.
Please look into [NVM](https://github.com/creationix/nvm#installation) or [N](https://github.com/tj/n#installation) for a simple process

***newrelic-neo4j***

After installing Nodejs you run `npm i -g newrelic-neo4j` and it will install the plugin

___

## Configuration

Please make sure that metrics options are turned on in Neo4j:
```
// default setting for enabling all supported metrics
metrics.enabled=true

// default setting for enabling all Neo4j specific metrics
metrics.neo4j.enabled=true

// setting for exposing metrics about transactions; number of transactions started, committed, etc.
metrics.neo4j.tx.enabled=true

// setting for exposing metrics about the Neo4j page cache; page faults, evictions, flushes and exceptions, etc.
metrics.neo4j.pagecache.enabled=true

// setting for exposing metrics about approximately entities are in the database; nodes, relationships, properties, etc.
metrics.neo4j.counts.enabled=true

// setting for exposing metrics about the network usage of the HA cluster component
metrics.neo4j.network.enabled=true
```
More info about Neo4j metrics [here](http://neo4j.com/docs/2.3.0/metrics-extension.html)

___

When installing, the plugin will attempt to copy a config file to `/etc/newrelic/newrelic-neo4j.js`. You can also use `--print-config` to print the current config file.
In the file you will find:
```javascript
module.exports = {
    pid: "/var/run/newrelic-neo4j.pid",
    log: "/var/log/newrelic-neo4j.log",

    // This is where you enter your license key
    license: "LICENSE KEY",

    // This is the name of the reporter
    name: "Database Name",

    // The database REST URL (usually http://domain.tld:7474 or https://domain.tld:7473)
    url: "Database URL",

    // OPTIONAL Set if the database requires an username and a password
    auth: {
        user: "neo4j",
        pass: "neo4j"
    },

    // Reporitng interval
    interval: 60
};
```

___

## Usage

After installing and configuring you can simply run:
```
newrelic-neo4j
```
and it will attempt to read the config file from `/etc/newrelic/newrelic-neo4j.js`.

The options are:
```
    -h, --help      see those options
    -c, --config    set the config file location
    -o, --out       set location to output log file
    -p, --pid       set pid location (/var/run/newrelic-neo4j.pid)
    -f, --fork      forks the process into a daemon
    --stop          reads the pid and attempts to close the app
    --print-config  prints set config or default if none is provided
```

___

## Support

For bugs and/or feature requests please refer to the [Github page](https://github.com/stefangab95/newrelic-neo4j).

___

## License

`newrelic-neo4j` plugin reporter is offered under MIT license. Please refer to [this page](https://github.com/stefangab95/newrelic-neo4j/blob/master/LICENSE) for more info.
