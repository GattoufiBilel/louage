let btnNotif = document.querySelectorAll('.list-group-item')
if (btnNotif) {
  btnNotif.forEach(b => {
    b.onclick = () => {
      let data = JSON.parse(b.getAttribute('data-notif'));
      document.querySelector('.modal-body').innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1" id="sujet">${data.sujet}</h5>
          <small><span class="badge badge-primary">${data.timestamp_notification}</span></small>
        </div>
        <p class="text-break mb-1">${data.message}</p>
        <small><i class="fas fa-map-marker-alt"></i> ${data.nom_station}</small>`
    }
  })
}

window.addEventListener('load', () => {
  function checkNotif (str) {
    return /^[a-z0-9\xBF-\xFF\%\-\+\.\$\/\=\(\)\&\!\?\;\:\, ]+$/gim.test(str)
  }

  let formNotif = document.getElementById('form-notif')
  if (formNotif) {

    let NOTIF_PATH = window.location.pathname.split('/').reverse()[0]
    let NOTIF_URL_API = NOTIF_PATH === 'envoyer' ? '/chefstation/notifications/envoyer' : '/chefstation/notifications/modifier'

    formNotif.onsubmit = (e) => {
      e.preventDefault()
      let idnotif = NOTIF_PATH === 'envoyer' ? '' : e.target.idnotif.value;
      let sujet = e.target.sujet.value;
      let msg = e.target.msg.value;
      let msgAlert = document.getElementById('msg-notif')
      if (checkNotif(sujet) && checkNotif(msg)) {
        fetch(NOTIF_URL_API, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ idnotif, sujet, msg })
        })
          .then(r => r.json())
          .then(r => {
            msgAlert.innerHTML = `<div class="alert alert-dark" role="alert"><i class="fas fa-info-circle"></i> ${r.msg}</div>`;
            if(NOTIF_PATH === 'modifier') {
              document.getElementById('sujet').textContent = sujet
              document.getElementById('msg').textContent = msg
            }
            formNotif.reset()
          })
          .catch(e => {
            msgAlert.innerHTML = `<div class="alert alert-danger" role="alert"><i class="fas fa-info-circle"></i> ${e.msg}</div>`
          })
      }
      else msgAlert.innerHTML = `<div class="alert alert-danger" role="alert"><i class="fas fa-info-circle"></i> Vous utilisez des caractères spéciaux invalide!</div>`
      return false
    }
  }
})