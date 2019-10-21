document.getElementById('form-desac').onsubmit = (e) => {
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
      if(r.msg.length > 15) {
        msg.innerHTML = `<div class="alert alert-danger" role="alert"><i class="fas fa-info-circle"></i> ${r.msg}</div>`
      }
      else window.location.replace("/register")
    })
    .catch(e => { msg.innerHTML = `<div class="alert alert-dark" role="alert"><i class="fas fa-info-circle"></i> ${r.msg}</div>` })
  return false
}