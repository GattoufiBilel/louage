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
  let formAjoutNotif = document.getElementById('form-ajout-notif')
  if(formAjoutNotif) {
    formAjoutNotif.onsubmit = (e) => {
      e.preventDefault()
      let sujet = e.target.sujet.value;
      let msg = e.target.msg.value;
      let msgAlert = document.getElementById('msg-notif')
      fetch('/chefstation/notifications/envoyer', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ sujet, msg })
      })
        .then(r => r.json())
        .then(r => {
          msgAlert.innerHTML = `<div class="alert alert-dark" role="alert"><i class="fas fa-info-circle"></i> ${r.msg}</div>`;
          formAjoutNotif.reset()
        })
        .catch(e => {
          msgAlert.innerHTML = `<div class="alert alert-danger" role="alert"><i class="fas fa-info-circle"></i> ${e.msg}</div>`
        })
      return false
    }
  }
})