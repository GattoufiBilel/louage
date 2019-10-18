const months = [
  "jan", "fév", "mars", "avril", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"
];

fetch('/chefstation/voyages.json')
  .then(res => res.json())
  .then(voyages => {
    let voyageParMoi = voyages.reduce((a, c) =>
      (v = months[new Date(c.date_depart).getMonth()], a[v] ? a[v]++ : a[v] = 1, a), [])

    let objReserv = []

    for (let i in voyageParMoi) {
      objReserv.push({ n: voyageParMoi[i], m: i, indx: months.indexOf(i) })
    }
    objReserv.sort((i, j) => i.indx - j.indx).unshift({ n: 0, m: 0, indx: 0 });

    var options = {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      series: [{ name: "nombre des voyages par mois", data: objReserv.map(v => v.n) }],
      dataLabels: { enabled: true },
      stroke: { curve: 'straight' },
      title: {
        text: 'nombre des voyages par mois', align: 'center'
      },
      colors: ['#28a745'],
      grid: {
        row: { borderColor: '#e7e7e7', colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      xaxis: { categories: objReserv.map(v => v.m) }
    }
    new ApexCharts(document.getElementById("voyages-chart"), options).render()
  })
  .catch(error => { })


fetch('/chefstation/reservations.json')
  .then(res => res.json())
  .then(reservations => {
    let reservByMonth = reservations.reduce((a, c) =>
      (v = months[new Date(c.timestamp_reservation).getMonth()], a[v] ? a[v]++ : a[v] = 1, a), [])

    let objReserv = []

    for (let i in reservByMonth) {
      objReserv.push({ n: reservByMonth[i], m: i, indx: months.indexOf(i) })
    }
    objReserv.sort((i, j) => i.indx - j.indx).unshift({ n: 0, m: 0, indx: 0 });

    var options = {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      series: [{ name: "nombre des reservations par mois", data: objReserv.map(v => v.n) }],
      dataLabels: { enabled: true },
      stroke: { curve: 'straight' },
      title: {
        text: 'nombre des reservations par mois', align: 'center'
      },
      colors: ['#28a745'],
      grid: {
        row: { borderColor: '#e7e7e7', colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      xaxis: { categories: objReserv.map(v => v.m) }
    }
    new ApexCharts(document.getElementById("revs-chart"), options).render()
  })
  .catch(error => { })