const { response } = require("express");
const SerialNumber = require("../models/serialnumbers");

const postSaveNewSerialNumber = async (req, res = response) => {
  //En este servicio recibimos solo el tipo de perfil del usuario
  const { profile } = req.body;

  try {
    //Función que crea una cadena de texto genérica
    function makeRandomString(length) {
      var result = "";
      var characters =
        "abcdefghjklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    //guardo la cadena de texto genérica para el nuevo serial number
    const serialNumber = makeRandomString(8);

    //de pasar las validaciones procede a guardar el usuario nuevo
    const newSerialNumber = new SerialNumber({serialNumber,profile, created_at: new Date(), updated_at: null, deleted_at: null});

    const saveSerialNumber = await newSerialNumber.save();

    if (saveSerialNumber) {
      res.status(201).json({
        ok: true,
        msg: "Serial Number created succesfully.",
        serialNumber
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Serial Number already exist!",
        serialNumber
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msgUX: "ERROR",
      msg: error,
    });
  }
};

module.exports = { postSaveNewSerialNumber };
