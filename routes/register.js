var router = require('express').Router()
var knex = require('../database/knex')
var { isConnected } = require('../middleware/authorisation')

const nodemailer = require('nodemailer')
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10;

router.get('/', isConnected, function (req, res) {
  res.render('register')
})

router.post('/', isConnected, function (req, res) {

  let { nom, prenom, email, password } = req.body

  bcrypt.hash(password, saltRounds)
    .then(function (hash) {

      knex('utilisateurs').insert({
        nom, prenom,
        email,
        password: hash, role: 'client',
        timestamp_utilisateur: new Date().toISOString()
      })
        .then(r => {
          let token = jwt.sign({ email }, 'shhhhh')
          let d = req.protocol + "://" + req.headers.host;
          let transporter = nodemailer.createTransport({
            service: 'zoho',
            host: 'smtp',
            port: 465,
            secure: true,
            auth: { user: process.env.EMAIL, pass: process.env.PASS_EMAIL }
          })

          let mailOptions = {
            from: `"Louage 👻" <${process.env.EMAIL}>`,
            to: email.trim(),
            subject: 'Clé d\'activation, envoyé par Louage.com',
            text: 'Merci de valider votre inscription',
            html: `
            <h3>Clé d'activation, envoyé par Louage.com</h3>
            <div><img src="https://i.ibb.co/K7KK032/logo.png" alt="logo" ></div>
            <p>Cliquez sur ce lien pour activer votre compte</p>
            <hr>
            <p>${d}/register/email/activation?key=${token}</p>
            <hr>
            <p>Merci et bonne journée.</p>
            <div><small>https://louage.herokuapp.com</small></div>`
          }

          transporter.sendMail(mailOptions, function (errMail, info) {
            res.render('register', { msg: 'Un lien a été envoyé vers ton email, veuillez vérifier votre boîte de réception.' })
          })
        })
        .catch(e => {
          res.render('register', { msg: 'Vous êtes deja inscrit!', e: 'error' })
        })
    })
    .catch(errHash => { res.redirect('/404') });
})

router.get('/email', isConnected, (req, res) => {
  res.render('register-valider')
})

router.get('/email/activation', isConnected, (req, res) => {  
  jwt.verify(req.query.key, 'shhhhh', function (err, decoded) {
    if (!err) {
      knex('utilisateurs').where({ email: decoded.email }).update({ etat_email: 1 })
        .then(r => { res.redirect('/login') })
        .catch(e => { res.render('register-valider', { msg: 'Clé secrete invalide.', e: 'error' }) })
    }
    else {
      res.render('register-valider', { msg: 'Clé n\'est pas valide! veuillez vérifier votre boîte de réception.', e: 'error' })
    }
  })
})

module.exports = router