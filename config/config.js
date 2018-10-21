
module.exports = {
  'db': {
    'host': 'localhost',
    'port': '3306',
    'login': 'root',
    'password': 'root',
    'database': 'message_sender'
  },
  'vk_api': {
    'max_recepients': 100
  },
  'queues': {
    'message_queue': {
      'name': 'messages',
      'concurrency': 3,
      'iteration_delay': 1,
      'requeue_after': 30
    }
  },
  'logger': {
    'log_path': './log.log'
  }
}
