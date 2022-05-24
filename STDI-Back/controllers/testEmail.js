const { response } = require("express");
const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const postTestEmail = async (req, res = response) => {
  //const {to, subject, text, html} = req.body;
  //const string = "brdfd-AEEW12";

  const msg = {
    to: "miguelgarciaparedes22@gmail.com",
    from: "info@stdicompany.com",
    subject: "Test",
    text: "Test",
    html: 'Test'
  }

  await sendgridMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
      res.json({
        ok: true,
        msg: "Correo enviado"
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: "No se envió correo."
      });
    });

};

module.exports = { postTestEmail };
