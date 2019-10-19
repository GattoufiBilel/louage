var express = require('express'),
  router = express.Router(),
  utilisateurDao = require('../../dao/utilisateurs.dao'),
  UtilisateurModel = require('../../model/Utilisateur.model'),
  { checkUserConnected } = require('../../middleware/authorisation'),
  objectTrim = require('../../util/objectTrim')

var bcrypt = require('bcrypt'), saltRounds = 10;
var multer = require('multer'), storage = multer.memoryStorage(), upload = multer({ storage: storage });
var sharp = require('sharp')

router.get('/profile', checkUserConnected, async (req, res) => {
  let { id } = req.session.userInfo

  const users = await utilisateurDao.getUserById(id)
  let encode = 'data:image/png;base64,' + users[0].avatar
  req.session.avatar = encode
  res.render('client/profile/index', { user: users[0], avatar: encode })
})

router.post('/profile', checkUserConnected, (req, res) => {
  let { nom, prenom, email, tel } = req.body;
  let { id } = req.session.userInfo
  let User = new UtilisateurModel(nom, prenom, email, '', tel)

  utilisateurDao.updateUser(id, objectTrim(User))
    .then(r => {
      res.json({
        msg: 'Votre profile a été bien modifiée'
      });
    })
    .catch(e => { res.json({ msg: 'erreur de modification!' }); })
})

/** user change password */
router.post('/profile/password', checkUserConnected, (req, res) => {
  let { npassword, ancien } = req.body
  let { email, password } = req.session.userInfo

  bcrypt.compare(ancien, password, function (err, cmpRes) {
    if (cmpRes) {
      bcrypt.hash(npassword, saltRounds)
        .then(function (hash) {
          utilisateurDao.updateUserPassword(email, hash)
            .then(r => { res.json({ msg: 'Votre mot de passe a été bien modifiée' }) })
            .catch(e => { res.json({ msg: 'Veuillez verifier votre mot de passe ' }) })
        })
        .catch(e => { res.redirect('/404') })
    }
    else res.json({ msg: 'Veuillez verifier votre mot de passe ' })
  })
})

/** user change avatar */
router.post('/profile/avatar', [checkUserConnected, upload.single("avatar")], (req, res) => {
  sharp(req.file.buffer)
    .resize(300, 300)
    .jpeg()
    .toBuffer()
    .then(function (data) {

      const encoded = data.toString("base64")

      utilisateurDao.updateAvatar(encoded, req.session.userInfo.email)
        .then(r => { res.redirect('/utilisateur/profile') })
        .catch(e => { res.render('client/profile/index', { msg: 'Erreur de modification' }) })
    })
    .catch(errd => { res.redirect('/404') })
})

router.post('/profile/desactiver', checkUserConnected, (req, res) => {
  let { password } = req.body
  let userPassword = req.session.userInfo.password

  bcrypt.compare(password, userPassword)
    .then(function (hashRes) {

      if (hashRes) {
        utilisateurDao.deleteUser(userPassword)
          .then(r => {
            req.session.destroy()
            req.session = null
            res.locals = null
            res.status(200).json({ msg: 'ok' })
          })
          .catch(error => { res.json({ msg: 'Veuillez verifier votre mot de passe' }) })
      }
      else { res.json({ msg: 'Veuillez verifier votre mot de passe' }) }
    })
    .catch(e => {
      res.json({ msg: 'Pour désactiver votre compte, vous devez contacter le service client.' })
    })
})

module.exports = router