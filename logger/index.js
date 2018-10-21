const utils = require('util')
const fs = require('fs')
const filePath = require('../config/config').logger.log_path

module.exports = {
  'info': (message, additionalObjects) => {
    const formattedMessage = utils.format('[%s] Level:%s %s. %s\r\n', (new Date()).toDateString(), 'info', message, JSON.stringify(additionalObjects))
    fs.appendFile(filePath, formattedMessage, (err) => {
      if (err) throw err
    })
  },
  'error': (message, additionalObjects) => {
    const formattedMessage = utils.format('[%s] Level:%s %s. %s\r\n', (new Date()).toDateString(), 'error', message, JSON.stringify(additionalObjects))
    fs.appendFile(filePath, formattedMessage, (err) => {
      if (err) throw err
    })
  }
}
