var router = require('express').Router()
var validContactForm = require('../middleware/validContactForm')
var checkValidCaptcha = require('../middleware/checkValidCaptcha')
var mailgun = require("../services/mailgun")

router.get('/', (req, res) => { res.render('contact') })

router.post('/', [checkValidCaptcha, validContactForm], (req, res) => {
  let { nom, sujet, email, message } = req.body

  mailgun(nom, email, sujet, message).then(r => {
    res.render('contact', { msg: 'Votre email a été bien envoyé' })
  })
    .catch(e => {
      res.render('contact', { msg: 'Cet email n\'est pas valide' })
    })
})

module.exports = router