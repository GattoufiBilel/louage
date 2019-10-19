let formDesac = document.getElementById('form-desac')
formDesac.onsubmit = (e) => {
  e.preventDefault()
  let password = e.target.password.value;
  let msg = document.getElementById('msg-desc')
  fetch('/utilisateur/profile/desactiver', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })
    .then(r => r.json())
    .then(r => {
      window.location.replace("/register")
    })
    .catch(e => { msg.innerHTML = `<div class="alert alert-dark" role="alert">${r.msg}</div>` })
  return false
}