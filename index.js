#!/usr/bin/env node
var argv = require("./args");
var config = require('./getConfig');
var logger = require("./prettyConsole");
var path = require('path');
var fs = require('fs');

if (argv.f || argv.fork) {
  logger.log("Forking process...");
  var args = [].concat(process.argv).slice(2);
  var child = require("daemon").daemon(path.join(__dirname, 'daemon.js'), args);
  logger.log('Forked child with pid ' + child.pid);
  fs.appendFileSync(global.PID, child.pid + '\n');
  process.exit(0);
}

if (argv.stop) {
  if (!fs.existsSync(global.PID)) {
    console.warn('Cannot find pid file!');
    process.exit(2);
  }
  logger.log('Reading pidfile', global.PID);
  var pids = fs.readFileSync(global.PID).toString().trim().split('\n');
  pids.forEach(function(pid) {
    try {
      console.log('Sending SIGTERM to', pid);
      process.kill(pid);
    } catch (ex) {
      console.error(ex);
    }
  });
  fs.unlinkSync(global.PID);
  process.exit(0);
}

if (argv['print-config']) {
  var configFile =
    (fs.existsSync(global.CONFIG_FILE) && require(global.CONFIG_FILE)) ||
    require('./config');

  logger.log(JSON.stringify(configFile, null, 4));
  process.exit(0);
}

if (!config) {
  console.warn('Config not provided, please refer to -h/--help');
  process.exit(1);
}
fs.appendFileSync(global.PID, process.pid + '\n');
require('./daemon');