const { response } = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../models/users");
const SerialNumber = require("../models/serialnumbers");
const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const postSaveNewUser = async (req, res = response) => {
  const { password, serialNumber, username, email, name } = req.body;

  //Transformamos el email a minúsculas
  const emailToLowerCase = email.toString().toLowerCase();
  const serialNumberToLowerCase = serialNumber.toString().toLowerCase();

  try {
    //Primero busco si el serial está en la BBDD colección serialnumber
    const serialNumberExist = await SerialNumber.findOne({ serialNumber: serialNumberToLowerCase });

    //Si no existe serial muestro error
    if (!serialNumberExist) {
      return res.status(400).json({
        ok: false,
        msg: "Serial Number non existent. Try again!",
      });
    }

    //Necesito el tipo del perfil que viene en el arreglo
    const profile = serialNumberExist.profile;

    //Si existe el serial en la colección users quiere decir que ya está usado
    const serialNumberExistInUsers = await Users.findOne({ serialNumber: serialNumberToLowerCase });

    //Si no existe serial muestro error
    if (serialNumberExistInUsers) {
      return res.status(400).json({
        ok: false,
        msg: "Serial Number is already used. Try again!",
      });
    }

    //de pasar las validaciones procede a guardar el usuario nuevo
    const newUser = new Users({
      name,
      serialNumber: serialNumber.toString().toLowerCase(),
      password,
      email: email.toString().toLowerCase(), //Guardar el email siempre en minúscula
      username: username.toString().toLowerCase(), //Guardar el username siempre en minúscula
      active: true,
      profile,
      created_at: new Date(),
      updated_at: null,
      deleted_at: null
    });

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(password, salt);

    const saveUser = await newUser.save();

    if (saveUser) {
      //variables del correo a enviar
      const msg = {
        to: emailToLowerCase,
        from: "info@stdicompany.com",
        subject: "Welcome to STDI Company",
        text: "Welcome to STDI Company",
        html:
          "Hi <b>" +
          name +
          "</b>, you've been registered into our STDI profiles." +
          " <a href='https://profile.stdicompany.com/'>Click here to login</a>" +
          " and live the STDI experience.",
      };

      await sendgridMail
        .send(msg)
        .then((response) => {
          console.log(response[0].statusCode);
          console.log(response[0].headers);
          res.status(201).json({
            ok: true,
            msg: "User created succesfully.",
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            ok: false,
            msg: "Email was not sent. Try again!",
          });
        });
    } else {
      return res.status(500).send({
        success: false,
        message: "User already exist!",
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msgUX: "ERROR",
      msg: "Refresh this page",
      error,
    });
  }
};

module.exports = { postSaveNewUser };
