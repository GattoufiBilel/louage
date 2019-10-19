var express = require('express')
var router = express.Router()
var stationDao = require('../dao/stations.dao')

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/search', (req, res) => {
  stationDao.getStations()
    .then(stations => { res.status(200).json(stations) })
    .catch(e => { res.status(404).json([]) })
})
module.exports = router