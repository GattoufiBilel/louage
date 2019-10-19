var router = require('express').Router()
var voyagesDao = require('../../dao/voyages.dao')
var stationDao = require('../../dao/stations.dao')

router.post('/', (req, res) => {
  let { nomstation, arrive, date } = req.body
  Promise.all([voyagesDao.getVoyages(), stationDao.getNomStations()])
    .then(values => {
      date = date && date.trim().length > 4 && Date.parse(date) >= Date.parse(new Date())
        ? date
        : (new Date()).toISOString().slice(0, 10);

      let voyages = []
      if (nomstation !== arrive) {
        voyages = values[0].filter(v =>
          v.nom_station === nomstation && v.arrive === arrive && v.date_depart === date
        )
      }
      else {
        voyages = values[0].filter(v => v.nom_station === nomstation && v.date_depart >= date)
      }

      res.render('client/voyages', { voyages, stations: values[1] })
    })
    .catch(e => { res.render('client/voyages') })
})

module.exports = router