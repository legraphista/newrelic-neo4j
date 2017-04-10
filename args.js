var argv = require("optimist").argv;
var path = require('path');

if (argv.help || argv.h) {
  console.log(
    `Usage: newrelic-neo4j [options]

Options
    -h, --help      see those options
    -c, --config    set the config file location
    -o, --out       set location to output log file
    -p, --pid       set pid location (/var/run/newrelic-neo4j.pid)
    -f, --fork      forks the process into a daemon
    --stop          reads the pid and attempts to close the app
    --print-config  prints set config or default if none is provided
`
  );
  process.exit();
}

global.CONFIG_FILE = path.resolve(argv.config || argv.c || "/etc/newrelic/newrelic-neo4j.js");
var config = require('./getConfig');

global.PID = path.resolve(
  argv.p ||
  argv.pid ||
  (config && config.pid) ||
  '/var/run/newrelic-neo4j.pid'
);

global.OUTPUT_LOG = argv.out || argv.o || (config && config.log);

if (global.OUTPUT_LOG) {
  global.OUTPUT_LOG = path.resolve(global.OUTPUT_LOG);
}

module.exports = argv;