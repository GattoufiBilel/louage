window.addEventListener('load', () => {
  let btnPayment = document.getElementById('btn-payment')
  let datexp = document.getElementById('datexp')

  btnPayment.disabled = true
  datexp.onkeyup = () => {
    if (datexp.value.length === 5 && /\d{2}\/\d{2}/g.test(datexp.value)) {
      let d = datexp.value.split('/')
      btnPayment.disabled = +d[1] > 14 && +d[0] > 0 && +d[0] < 13 ? false : true
    }
    else { btnPayment.disabled = true }
  }

})