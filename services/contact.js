var mailgun = require("../subscribers/mailgun")

function sendEmail (req, res) {
  let { nom, sujet, email, message } = req.body

  mailgun(nom, email, sujet, message)
    .then(r => { res.render('contact', { msg: 'Votre email a été bien envoyé' }) })
    .catch(e => { res.render('contact', { msg: 'Cet email n\'est pas valide' }) })
}

module.exports = sendEmail