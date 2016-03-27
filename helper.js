var request = require("request");

var logger = require("./prettyConsole");

var helper = {};

helper.infoStrings = {};
helper.infoStrings.types = {
    fileSize: 'org.neo4j:instance=kernel#0,name=Store file sizes',
    counts: 'org.neo4j:instance=kernel#0,name=Primitive count',
    cache: 'org.neo4j:instance=kernel#0,name=Page cache',
    trx: 'org.neo4j:instance=kernel#0,name=Transactions'
};

helper.infoStrings.toArray = () => Object.keys(helper.infoStrings.types).map(key => helper.infoStrings.types[key]);
helper.infoStrings.findKeyOfVal = (val) => Object.keys(helper.infoStrings.types).filter(k => helper.infoStrings.types[k] == val)[0];
helper.infoStrings.parseArray = (arr) => arr
    .map(entry => {
        entry["attributes"] = entry["attributes"].arrayToObject("name");
        return entry
    })
    .arrayToObject("name");

/**
 * Computes the auth string
 * @param {String} user
 * @param {String} pass
 * @returns {string}
 */
helper.getAuthString = (user, pass) => {
    "use strict";
    return (new Buffer(`${user}:${pass}`)).toString("base64");
};

/**
 *
 * @param {Object} options
 * @param {String} options.host
 * @param {String} options.port
 * @param {String} options.url
 * @param {Object} options.auth
 * @param {String} options.auth.user
 * @param {String} options.auth.pass
 * @param {function(Error, Array<Object>)} callback
 */
helper.getServerInfo = (options, callback) => {
    var method = "POST";
    var url = `${( options.url || `${options.host}:${options.port}` )}/db/manage/server/jmx/query`;

    var headers = {
        'cache-control': 'no-cache',
        "content-type": "application/json"
    };
    if (options.auth) {
        headers["authorization"] = `Basic ${helper.getAuthString(options.auth.user, options.auth.pass)}`;
    }

    var body = helper.infoStrings.toArray();

    logger.log("Poling Neo4J Database ...");

    request({
        method,
        url,
        headers,
        body,
        json: true
    }, (err, http, data)=> {
        "use strict";
        if (err) throw err;
        if (http.statusCode != 200) throw data;

        logger.log("Neo4J responded accordingly");

        data = helper.infoStrings.parseArray(data);

        return callback(null, data);
    });
};

/**
 * Merges an array into a key-value obj with the key keyForObject and item data of keyToStore
 * @param {String} keyForObject
 * @param {String=} keyToStore
 * @returns {{}}
 */
Array.prototype.arrayToObject = function (keyForObject, keyToStore) {
    "use strict";
    var obj = {};
    this.forEach(item => obj[item[keyForObject]] = keyToStore ? item[keyToStore] : item);
    return obj;
};

module.exports = helper;