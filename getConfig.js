var fs = require('fs');
if (global.CONFIG_FILE && fs.existsSync(global.CONFIG_FILE)) {
  module.exports = require(global.CONFIG_FILE);
} else {
  module.exports = null;
}