const db = require('../db/')
const config = require('../config/config')

module.exports = {
  'common': function (message, res) {
    db.User.count().then(c => {
      let jobs = []
      for (let i = 0; i < c; i += config.vk_api.max_recepients) {
        jobs.push({
          'queue': config.queues.message_queue.name,
          'payload': {
            'offset': i,
            'text': message
          }
        })
      }
      return db.Job.bulkCreate(jobs)
    }).then(() => {
      res.send('Your message traveliing space and time to all users.').end()
    })
  },
  'personified': function (template, res) {
    db.sequelize.query('SELECT name, COUNT(id) as cnt FROM users GROUP BY name', { 'type': db.sequelize.QueryTypes.SELECT }).then(names => {
      let jobs = []
      for (let i = 0; i < names.length; i++) {
        let message = template.replace('{user_name}', names[i].name)
        let offset = 0
        do {
          jobs.push({
            'queue': config.queues.message_queue.name,
            'payload': {
              'condition': {
                'name': names[i].name
              },
              'offset': offset,
              'text': message
            }
          })
          offset += config.vk_api.max_recepients
          names[i].cnt -= config.vk_api.max_recepients
        } while (names[i].cnt > config.vk_api.max_recepients)
      }
      return db.Job.bulkCreate(jobs)
    }).then(() => {
      res.send('Your message traveliing space and time to all users.').end()
    })
  }

}
