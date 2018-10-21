const User = require('../../db').User
const config = require('../../config/config').vk_api
const logger = require('../../logger')
const API = require('../../vk_api')

module.exports = (payload, resolve, reject) => {
  let queryParts = {
    'limit': config.max_recepients
  }
  if (payload.hasOwnProperty('offset')) {
    queryParts.offset = payload.offsets
  }
  if (payload.hasOwnProperty('condition')) {
    queryParts.where = payload.condition
  }

  User.findAll(queryParts).then(users => {
    const vkJob = users.map(user => {
      return user.vkID
    })
    return API.sendNotification(vkJob, payload.message)
  }).catch(e => {
    reject(e)
  }).then(users => {
    logger.info('Messages sent successfully', { 'message': payload.message, 'users': users })
    resolve()
  }).catch(e => {
    reject(e)
  })
}
