var helper = require("./helper");
var cache = {};

cache._cache = {};

cache.get = (key) => cache[key];
cache.set = (key, val) => cache[key] = val;

cache.cacheWhatNeedsToBeCached = function (data) {
    "use strict";

    if (data[helper.infoStrings.types.trx]) {
        cache.set(
            "NumberOfCommittedTransactions",
            data[helper.infoStrings.types.trx]["attributes"]["NumberOfCommittedTransactions"]["value"]
        );
        cache.set(
            "NumberOfOpenedTransactions",
            data[helper.infoStrings.types.trx]["attributes"]["NumberOfOpenedTransactions"]["value"]
        );
        cache.set(
            "NumberOfRolledBackTransactions",
            data[helper.infoStrings.types.trx]["attributes"]["NumberOfRolledBackTransactions"]["value"]
        );
    }

    if (data[helper.infoStrings.types.cache]) {
        Object.keys(data[helper.infoStrings.types.cache]["attributes"]).forEach(key=> {
            cache.set(
                key,
                data[helper.infoStrings.types.cache]["attributes"][key]["value"]
            );
        });
    }
};

/**
 * Gets diffs from last interval to this interval
 * @param data
 * @returns {{NumberOfCommittedTransactions: number, NumberOfOpenedTransactions: number, NumberOfRolledBackTransactions: number}}
 */
cache.deltaCacheValues = function (data) {
    "use strict";
    var returnObj = {};

    if (data[helper.infoStrings.types.trx]) {
        var NumberOfCommittedTransactions =
            data[helper.infoStrings.types.trx]["attributes"]["NumberOfCommittedTransactions"]["value"] -
            cache.get("NumberOfCommittedTransactions");

        var NumberOfOpenedTransactions =
            data[helper.infoStrings.types.trx]["attributes"]["NumberOfOpenedTransactions"]["value"] -
            cache.get("NumberOfOpenedTransactions");

        var NumberOfRolledBackTransactions =
            data[helper.infoStrings.types.trx]["attributes"]["NumberOfRolledBackTransactions"]["value"] -
            cache.get("NumberOfRolledBackTransactions");

        returnObj = {
            NumberOfCommittedTransactions,
            NumberOfOpenedTransactions,
            NumberOfRolledBackTransactions
        };
    }

    if (data[helper.infoStrings.types.cache]) {
        Object.keys(data[helper.infoStrings.types.cache]["attributes"]).forEach(key=> {
            returnObj[key] =
                data[helper.infoStrings.types.cache]["attributes"][key]["value"] -
                cache.get(key);
        });
    }

    cache.cacheWhatNeedsToBeCached(data);

    return returnObj;
};

module.exports = cache;