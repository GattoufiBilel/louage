let formProf = document.querySelector('.form-profile')
formProf.onsubmit = (e) => {
  e.preventDefault()
  let nom = e.target.nom.value;
  let prenom = e.target.prenom.value;
  let email = e.target.email.value;
  let tel = e.target.tel.value;
  let msg = document.getElementById('msg-profile')
  fetch('/utilisateur/profile', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ nom, prenom, email, tel })
  })
    .then(r => r.json())
    .then(r => {
      msg.innerHTML = `<div class="alert alert-dark" role="alert">${r.msg}</div>`
    })
    .catch(e => {
      msg.innerHTML = `<div class="alert alert-dark" role="alert">${r.msg}</div>`
    })
  return false
}