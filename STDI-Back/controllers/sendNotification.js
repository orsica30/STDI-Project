const { response } = require("express");
const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const postSendNotification = async (req, res = response) => {
  const { to, latitude, longitude } = req.body;
  //const string = "brdfd-AEEW12";

  const msg = {
    to: to,
    from: "info@stdicompany.com",
    subject: "Your STDI profile have been seen",
    //text: "Test",
    html:
      "Hi there, you got a new view at your profile at this Location.<br/>Latitude: " +
      latitude +
      "<br/>Altitude: " +
      longitude +
      "<br/>You can take a better look at the location if you <a target='_blank' href='https://maps.google.com/?q=" +
      latitude +
      "," +
      longitude +
      "'>click here</a>",
  };

  await sendgridMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
      res.json({
        ok: true,
        msg: "Correo enviado",
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: "No se envió correo.",
      });
    });
};

module.exports = { postSendNotification };
