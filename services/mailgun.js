var mailgun = require("mailgun-js")
module.exports = (function (nom, email, sujet, message) {
  return new Promise((resolve, reject) => {
    let data = {
      from: `Louage : ${nom} <${email}>`,
      to: "haikel.fazzani@zoho.com",
      subject: sujet,
      text: message
    };

    let mg = mailgun({ apiKey: process.env.MAILJET_SECRET_KEY, domain: process.env.MAILJET_API_KEY });
    mg.messages().send(data, function (e, body) {
      if (e) reject(e)
      else resolve(body)
    })
  })
})