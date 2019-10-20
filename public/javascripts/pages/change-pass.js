let btnPass = document.getElementById('btn-submit-pass')
  btnPass.disabled = true

  let confPass = document.getElementById('confpassword')
  confPass.onkeyup = (e) => {
    let val = e.target.value
    if (/[a-z0-9\s+\#\-\.\_]/gi.test(val)) {
      let nPass = document.getElementById('npassword').value
      btnPass.disabled = val === nPass ? false : true
    }
  }

let frmChangePass = document.getElementById('form-pass')
frmChangePass.onsubmit = (e) => {
  e.preventDefault()
  let ancien = e.target.ancien.value;
  let npassword = e.target.npassword.value;
  let confpassword = e.target.confpassword.value;
  let msg = document.getElementById('msg-ch-pass')
  fetch('/utilisateur/profile/password', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ ancien, npassword, confpassword })
  })
    .then(r => r.json())
    .then(r => {
      msg.innerHTML = `<div class="alert alert-dark" role="alert">${r.msg}</div>`
    })
    .catch(e => {
      console.log(e);
      
      msg.innerHTML = `<div class="alert alert-dark" role="alert">${r.msg}</div>`
    })
  return false
}