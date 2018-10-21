module.exports = {
  'sendNotification': (users, mesasge) => {
    return new Promise((resolve, reject) => {
      if (Math.random() > 0.5) {
        resolve(users)
      } else {
        reject(new Error('Server internal error'))
      }
    })
  }
}
