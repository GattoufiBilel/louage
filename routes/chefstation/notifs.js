var router = require('express').Router()
var notifsDao = require('../../dao/notifications.dao')
var Notification = require('../../model/Notification')
var { checkUserConnected, checkUserRoleChef } = require('../../middleware/authorisation')

router.get('/', [checkUserConnected, checkUserRoleChef], (req, res) => {
  notifsDao.getNotifisByChefStation(req.session.userInfo.id)
    .then(notifications => { res.render('chefstation/notifs/lister', { notifications }) })
    .catch(e => { res.render('chefstation/notifs/lister') })
})

router.get('/envoyer', [checkUserConnected, checkUserRoleChef], (req, res) => {
  res.render('chefstation/notifs/ajout')
})

router.post('/envoyer', [checkUserConnected, checkUserRoleChef], (req, res) => {
  let { id } = req.session.userInfo
  let { nom_station } = req.session.chefStationInfo
  let { sujet, msg } = req.body
  notifsDao.addNotification(new Notification(sujet, msg, nom_station, id))
    .then(r => { res.json({ msg: 'Notification a été bien envoyée' }) })
    .catch(e => { res.json({ msg: 'Erreur d\'envoie, réessayez plus tard', e: 'error' }) })
})

router.get('/modifier', [checkUserConnected, checkUserRoleChef], (req, res) => {
  notifsDao.getNotifisById(req.query.notif)
    .then(result => { res.render('chefstation/notifs/modifier', { notification: result[0] }) })
    .catch(e => { res.render('chefstation/notifs') })
})

router.post('/modifier', [checkUserConnected, checkUserRoleChef], (req, res) => {
  let { sujet, msg, idnotif } = req.body
  let notif = new Notification(sujet, msg, '', '')
  notifsDao.updateNotification(notif, idnotif)
    .then(r => { res.json({ msg: 'Notification a été bien modifiée' }) })
    .catch(e => { res.json({ msg: 'Erreur d\'envoie' }) })
})

router.get('/supprimer', [checkUserConnected, checkUserRoleChef], (req, res) => {
  notifsDao.deletNotification(req.query.notif)
    .then(r => { res.status(200).json({ msg: 'Une notification a été bien supprimer' }) })
    .catch(e => { res.status(404).json({ msg: 'Vous ne pouvez pas supprimer cette notification' }) })
})

module.exports = router