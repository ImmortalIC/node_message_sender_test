const db = require('../db')
const logger = require('../logger/')
const config = require('../config/config')
const path = require('path')
let workers = {}

for (const queueName in config.queues) {
  const queue = config.queues[queueName]
  workers[queue.name] = require(path.join(__dirname, 'workers/', queue.name))
}

function workerLaunch (queue) {
  let restartFailedAt = new Date()
  restartFailedAt.setTime(restartFailedAt.getTime() - queue.requeue_after * 1000)

  db.sequelize.query("UPDATE jobs SET status='reserved' " +
    "WHERE queue=:name AND (status='ready' OR (status='failed' AND updatedAt<:retry_time)) and last_insert_id(id)  ORDER BY id LIMIT 1", {
    'replacements': { 'retry_time': restartFailedAt.toISOString(), 'name': queue.name }
  }).then((results, metadata) => {
    if (results[0].changedRows === 0) {
      return null
    }
    return db.sequelize.query('SELECT LAST_INSERT_ID() as id')
  }).then(result => {
    const id = result[0][0]['id']
    return db.Job.findByPk(id)
  }).then(job => {
    logger.info('Starting job', { 'job': job.payload })
    return new Promise((resolve, reject) => {
      workers[queue.name](job.payload, resolve, reject)
    }).then(() => {
      logger.info('Job done!', { 'job': job.payload })
      job.status = 'done'
      return job.save()
    }).catch((e) => {
      logger.error('Job failed', { 'job': job.payload, 'error': e })
      job.status = 'failed'
      return job.save()
    })
  }).finally(() => {
    setTimeout(() => {
      workerLaunch(queue)
    }, queue.iteration_delay)
  })
}

module.exports = {
  'start': function () {
    for (const queueName in config.queues) {
      const queue = config.queues[queueName]
      for (let i = 0; i < queue.concurrency; i++) {
        workerLaunch(queue)
        console.log('worker started\n')
      }
    }
  }

}
