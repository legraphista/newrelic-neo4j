#!/usr/bin/env node
require('./args');

var logger = require("./prettyConsole");

var options = require('./getConfig');

var helper = require("./helper");
var cache = require("./cache");
var newrelic = require("./newrelic");
var fs = require('fs');

logger.hr();
logger.log("Starting neo4j reporter process");
logger.hr();

helper.getServerInfo.call(helper, options, (err, data) => {
  "use strict";
  logger.log("Building first time cache");
  cache.cacheWhatNeedsToBeCached(data);
});
setInterval(helper.getServerInfo.bind(helper, options, refreshStats), options.interval * 1000);

function refreshStats(err, data) {
  "use strict";
  if (err) throw err;

  logger.log("Refreshing data");

  var prettyData = (
    extractedDataToStringValueArray(
      extractData(
        data
      )
    )
  );

  newrelic.sendData(prettyData);
}

function extractData(data) {
  "use strict";
  var cacheDelta = cache.deltaCacheValues(data);

  var object = {};

  if (data[helper.infoStrings.types.fileSize]) {
    var databaseStorage = data[helper.infoStrings.types.fileSize]["attributes"];
    object["Database Storage"] = {
      NodeStoreSize: databaseStorage["NodeStoreSize"]["value"],
      LogicalLogSize: databaseStorage["LogicalLogSize"]["value"],
      ArrayStoreSize: databaseStorage["ArrayStoreSize"]["value"],
      StringStoreSize: databaseStorage["StringStoreSize"]["value"],
      PropertyStoreSize: databaseStorage["PropertyStoreSize"]["value"],
      RelationshipStoreSize: databaseStorage["RelationshipStoreSize"]["value"],

      __typedef: 'bytes'
    };

    var databaseStorageTotal = data[helper.infoStrings.types.fileSize]["attributes"];
    object["Database Storage Total"] = {
      TotalStoreSize: databaseStorageTotal["TotalStoreSize"]["value"],

      __typedef: 'bytes'
    };
  }

  if (data[helper.infoStrings.types.counts]) {
    var databaseIdCounts = data[helper.infoStrings.types.counts]["attributes"];
    object["Database IDs"] = {
      NumberOfNodeIdsInUse: databaseIdCounts["NumberOfNodeIdsInUse"]["value"],
      NumberOfPropertyIdsInUse: databaseIdCounts["NumberOfPropertyIdsInUse"]["value"],
      NumberOfRelationshipIdsInUse: databaseIdCounts["NumberOfRelationshipIdsInUse"]["value"],
      NumberOfRelationshipTypeIdsInUse: databaseIdCounts["NumberOfRelationshipTypeIdsInUse"]["value"],

      __typedef: 'ids'
    };
  }

  if (data[helper.infoStrings.types.cache]) {
    object["Cache Disk"] = {
      BytesRead: cacheDelta["BytesRead"],
      BytesWritten: cacheDelta["BytesWritten"],

      __typedef: 'bytes'
    };

    var cacheDisk = data[helper.infoStrings.types.cache]["attributes"];
    object["Cache Disk Total"] = {
      BytesRead: cacheDisk["BytesRead"]["value"],
      BytesWritten: cacheDisk["BytesWritten"]["value"],

      __typedef: 'bytes'
    };

    object["Eviction"] = {
      "Eviction[ops]": cacheDelta["Evictions"],
      "Exceptions[ops]": cacheDelta["EvictionExceptions"]
    };

    object["Flushes"] = {
      "Flushes[ops]": cacheDelta["Flushes"],
      "Faults[ops]": cacheDelta["Faults"]
    };
    var flushes = data[helper.infoStrings.types.cache]["attributes"];
    object["Flushes Total"] = {
      Count: flushes["Flushes"]["value"],
      Faults: flushes["Faults"]["value"],

      __typedef: 'ops'
    };


    object["Pins"] = {
      "Pins[ops]": cacheDelta["Pins"],
      "Unpins[ops]": cacheDelta["Unpins"]
    };

    object["Mappings"] = {
      "FileMappings[ops]": cacheDelta["FileMappings"],
      "FileUnmapping[ops]": cacheDelta["FileUnmappings"]
    };
    var mapping = data[helper.infoStrings.types.cache]["attributes"];
    object["Mappings Total"] = {
      FileMappings: mapping["FileMappings"]["value"],
      FileUnmappings: mapping["FileUnmappings"]["value"],

      __typedef: 'ops'
    };
  }

  if (data[helper.infoStrings.types.trx]) {
    object["Transactions"] = {
      NumberOfCommittedTransactions: cacheDelta["NumberOfCommittedTransactions"],
      NumberOfRolledBackTransactions: cacheDelta["NumberOfRolledBackTransactions"],

      __typedef: 'transactions'
    };

    object["Hits"] = {
      Hits: cacheDelta["NumberOfOpenedTransactions"],

      __typedef: 'hits'
    };
  }

  return object;
}

function extractedDataToStringValueArray(data) {
  "use strict";
  var metricsObj = {};
  Object
    .keys(data)
    .map(category => {
      var template = `Component/${category}`;
      Object
        .keys(data[category])
        .filter(x => x.slice(0, 2) != "__")
        .forEach(label => {
          var name = `${template}/${label}`;
          if (data[category].__typedef) name = `${name}[${data[category].__typedef}]`;
          metricsObj[name] = data[category][label];
        });
    });

  return metricsObj;
}

process.on('uncaughtException', (err) => {
  logger.error(`Caught exception: ${err.stack || JSON.stringify(err)}`);
});

function _cleanUp() {
  try {
    logger.log('Cleaning up for pid ' + process.pid);
    var pids = fs.readFileSync(global.PID).toString().split('\n').filter(function(x) {
      return x !== process.pid.toString();
    });

    fs.writeFileSync(global.PID, pids.join('\n'));
  } catch (ex) {
    // silent error
  }
  process.nextTick(function() {
    process.exit(0);
  });
}

process.on('SIGINT', _cleanUp);
process.on('SIGTERM', _cleanUp);