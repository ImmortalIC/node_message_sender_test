module.exports = function (sequelize, types) {
  var Job = sequelize.define('jobs', {
    'queue': types.STRING,
    'payload': types.JSON,
    'status': types.ENUM('ready', 'reserved', 'failed', 'done')
  },
  {
    'hooks': {
      'beforeCreate': (job, options) => {
        job.status = 'ready'
      },
      'beforeBulkCreate': (jobs, options) => {
        jobs = jobs.map((job) => {
          job.status = 'ready'
          return job
        })
      }
    }
  })
  return Job
}
