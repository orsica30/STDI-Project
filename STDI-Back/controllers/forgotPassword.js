const { response } = require("express");
const bcrypt = require("bcryptjs");
const UserData = require("../models/users");
const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const postForgotPassword = async (req, res = response) => {

  //En este servicio recibimos solo el correo del usuario
  const {
    email
  } = req.body;

  //Transformamos el email a minúsculas
  const emailToLowerCase = email.toString().toLowerCase();

  //Función que crea una cadena de texto genérica
  function makeRandomString(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //guardo la cadena de texto genérica para el password temporal
  const newPassword = makeRandomString(8);

  try {
    const user = await UserData.findOne({ email: emailToLowerCase });

    //Obtenemos el id del usuario encontrado
     if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "User is not registered. Try again.",
      });
    }

    const userID = user.id;
    const name=user.name;
    const username = user.username;
    const serialNumber = user.serialNumber;
    //Si pasa validaciones, procede a encriptar contraseña
    const salt = bcrypt.genSaltSync();
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    //Envío el arreglo con el nuevo password
    const newProfileData = {
      name,
      username,
      email: emailToLowerCase,
      serialNumber,
      password: hashedNewPassword,
      updated_at: new Date()
    };

    //Actualizamos los registros del usuario (solo el password nuevo)
    const updateData = await UserData.findByIdAndUpdate(userID, newProfileData);
    
    //variables del correo a enviar
    const msg = {
      to: emailToLowerCase,
      from: "info@stdicompany.com",
      subject: "Forgot Password",
      text: "Forgot Password",
      html: 'Your new password is <b>' + newPassword + "</b>. Use it to log in again in your STDI profile.",
    };
  
    await sendgridMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
        res.json({
          ok: true,
          msg: "Password was sent to your email, please follow the steps to login again."
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({
          ok: false,
          msg: "Email was not sent. Try again!"
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact this site's admin",
    });
  }
};

module.exports = { postForgotPassword };
