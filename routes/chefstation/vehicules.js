var router = require('express').Router()
var { checkUserConnected, checkUserRoleChef } = require('../../middleware/authorisation')

var vehiculeDao = require('../../dao/vehicules.dao')
var Vehicule = require('../../model/Vehicule.model')

router.get('/', (req, res) => {
  vehiculeDao.getVehicules()
    .then(vehicules => {
      res.render('chefstation/vehicule/lister', { vehicules })
    })
    .catch(error => {
      res.render('chefstation/vehicule/lister')
    })
})

router.get('/ajout', [checkUserConnected, checkUserRoleChef], (req, res) => {
  res.render('chefstation/vehicule/ajout')
})

router.post('/ajout', [checkUserConnected, checkUserRoleChef], (req, res) => {
  let { numSerie, proprietaire, nbPlaces } = req.body
  let newVehicule = new Vehicule(numSerie, proprietaire, nbPlaces)

  vehiculeDao.addVehicule(newVehicule)
    .then(r => {
      res.redirect('/chefstation/vehicules')
    })
    .catch(e => {
      res.render('chefstation/vehicule/ajout', { msg: 'Vehicule deja existe' })
    })
})

router.get('/supprimer', [checkUserConnected, checkUserRoleChef], function (req, res) {
  vehiculeDao.deletVehicule(req.query.numserie)
  .then(r => { res.status(200).json({ msg: 'Une véhicule a été bien supprimer' }) })
  .catch(e => { res.status(404).json({ msg: 'vous ne pouvez pas supprimer cette véhicule' }) })
})

router.get('/modifier', [checkUserConnected, checkUserRoleChef], function (req, res) {
  vehiculeDao.getVehicule(req.query.numserie)
    .then(vehicule => {
      res.render('chefstation/vehicule/modifier', { vehicule })
    })
    .catch(error => {
      res.redirect('/404')
    })
})

router.post('/modifier', [checkUserConnected, checkUserRoleChef], function (req, res) {
  let { numserie, proprietaire, nbPlaces } = req.body
  let newVehicule = new Vehicule(numserie, proprietaire, nbPlaces)

  vehiculeDao.updateVehicule(newVehicule)
    .then(result => {
      res.redirect('/chefstation/vehicules')
    })
    .catch(error => {
      res.redirect('/404')
    })
})

module.exports = router