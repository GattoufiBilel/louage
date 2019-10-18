var router = require('express').Router()
var voyagesDao = require('../../dao/voyages.dao')

router.post('/', (req, res) => {
  let { nomstation, arrive, date } = req.body
  voyagesDao.getVoyages()
    .then(values => {
      date = date && date.trim().length > 4 && Date.parse(date) >= Date.parse(new Date())
        ? date
        : (new Date()).toISOString().slice(0, 10);

      let voyages = values.filter(v =>
        v.nom_station === nomstation && v.arrive === arrive && v.date_depart === date
      )      

      let stations = values.filter((v, i, self) =>
        i === self.findIndex((t) => (t.nom_station === v.nom_station))
      )
      res.render('client/voyages', { voyages, stations })
    })
    .catch(e => { console.log(e);
     res.render('client/voyages') })
})

module.exports = router