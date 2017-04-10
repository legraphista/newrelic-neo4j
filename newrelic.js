var process = require("process");
var os = require("os");

var request = require("request");

var packageJson = require("./package.json");
var config = require(global.CONFIG_FILE);
var logger = require("./prettyConsole");

var newrelic = {};

newrelic.sendData = function (data) {
    "use strict";
    var pid = process.pid;
    var version = packageJson.version;
    var host = os.hostname();

    var agent = {
        host,
        pid,
        version
    };

    var name = config.name;
    var guid = "Neo4j";
    var duration = config.interval;
    var metrics = data;

    var components = [{
        name,
        guid,
        duration,
        metrics
    }];

    var body = {
        agent,
        components
    };

    logger.log("Sending stats to newrelic...");
    Object.keys(data).map(key=>`    ${key}: ${data[key]}`).forEach(logger.log);

    request({
        url: "https://platform-api.newrelic.com/platform/v1/metrics",
        headers: {
            "X-License-Key": config.license,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body,
        json: true
    }, (err, http, data)=> {
        if (err) throw err;
        if (http.statusCode != 200) throw data;

        logger.log("Got Ok from Newrelic");
        logger.hr();
    });
};

module.exports = newrelic;