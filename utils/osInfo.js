const os = require('os')

var networkInterfaces = os.networkInterfaces()

var address = networkInterfaces['Wi-Fi'][1].address

module.exports = address