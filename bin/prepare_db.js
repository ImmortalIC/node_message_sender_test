const db = require('../db/')

const names = [
  'John',
  'Mike',
  'Stan',
  'Lyalah',
  'Gagarin',
  'Stella',
  'Hilda',
  'Peter',
  'Wolf',
  'Dayman',
  'Nightman',
  'Penny',
  'Lenin',
  'Voldemar'
]

db.Job.sync({ 'force': true }).then(() => {
  console.log('Job table created\n')
})

db.User.sync({ 'force': true }).then(() => {
  console.log('User table created')
  let users = []

  for (let i = 0; i < 10000; i++) {
    users.push({
      'name': names[Math.ceil(Math.random() * (names.length - 1))],
      'vkID': Math.ceil(Math.random() * 10000000)
    })
  }

  return db.User.bulkCreate(users)
}).then(() => {
  console.log('users seeded\n')
  process.exit()
})
