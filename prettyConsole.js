var prettyConsole = {};
var fs = require("fs");

function logToFile(message){
    "use strict";
    if(!GLOBAL.OUTPUT_LOG) return;

    fs.appendFile(GLOBAL.OUTPUT_LOG, message + "\n");
}

function pad(msg, cnt, chr) {
    "use strict";
    msg = String(msg);
    while (cnt > msg.length) {
        msg = (chr || "0") + msg;
    }
    return msg;
}

prettyConsole.hr = () => {
    "use strict";
    var c = process.stdout.columns || 80;
    console.log("~".repeat(c));
    logToFile("~".repeat(c));
};

prettyConsole.getTime = ()=> {
    "use strict";
    var now = new Date();
    return `${now.getTime()} / ${now.getYear() + 1900}-${pad(now.getMonth(), 2)}-${pad(now.getDate(), 2)} \
${pad(now.getHours(), 2)}:${pad(now.getMinutes(), 2)}:${pad(now.getSeconds(), 2)}`;
};

prettyConsole.log = (message) => {
    var print = `${prettyConsole.getTime()} : [LOG] ${message}`;
    console.log(print);
    logToFile(print);
};

prettyConsole.error = (message) => {
    var print = `${prettyConsole.getTime()} : [ERR] ${message}`;
    console.error(print);
    logToFile(print);
};

module.exports = prettyConsole;