/** Contact Page Form */
let btnSend = document.getElementById('btn-send-mail'), r = '';
if (btnSend) {
  btnSend.disabled = true;
  let check = (s) => /^[a-z0-9\;\.\,\+\-\s+ ]+$/gmi.test(s);
  document.getElementById('message').onkeyup = (e) => {
    r = e.target.value;
    if (check(r.replace(/\r|\n/g, ''))) {
      if (r.length > 50) btnSend.disabled = false;
      else btnSend.disabled = true;
    }
    else {
      btnSend.disabled = true
    }
  }
}