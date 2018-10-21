const express = require('express')
const router = express.Router()
const messanger = require('../services/message_job_creator')
/* GET home page. */
router.post('/send', function (req, res, next) {
  if (req.body.template.match(/{user_name}/)) {
    messanger.personified(req.body.template, res)
  } else {
    messanger.common(req.body.template, res)
  }
})

module.exports = router
