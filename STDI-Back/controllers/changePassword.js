const { response } = require("express");
const bcrypt = require("bcryptjs");
const UserData = require("../models/users");
//const { generateJWT } = require("../helpers/jwt");

const postChangePassword = async (req, res = response) => {
  const {
    name,
    username,
    email,
    serialNumber,
    password,
    newPassword,
    confirmNewPassword,
  } = req.body;

  try {
    const user = await UserData.findOne({ email });
    if (!user) {
      return res.json({
        ok: false,
        msg: "User is not registered. Try again.",
      });
    }

    //Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.json({
        ok: false,
        msg: "Password does not match. Try again.",
      });
    }

    //Confirmar que el nuevo password y confirmar nuevo password sean iguales
    if (newPassword !== confirmNewPassword) {
      return res.json({
        ok: false,
        msg: "New Password does not match. Try again.",
      });
    }

    //Si pasa validaciones, procede a encriptar contraseña
    const salt = bcrypt.genSaltSync();
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    //Envío el arreglo con el nuevo password y antiguos datos
    const newProfileData = {
      name,
      username,
      email,
      serialNumber,
      password: hashedNewPassword,
      deleted_at: new Date()
    };
    console.log(user.id);
    const updateData = await UserData.findByIdAndUpdate(user.id, newProfileData);

    if(updateData){
      res.json({
        ok: true,
        msg: "Password changed succesfully",
        //newProfileData,
      });
    }else{
      res.json({
        ok: false,
        msg: "Sorry, please try again.",
        //newProfileData,
      });
    }

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor contacte al administrador",
    });
  }
};

module.exports = { postChangePassword };
