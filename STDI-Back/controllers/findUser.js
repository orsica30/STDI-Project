const { response } = require("express");
//const bcrypt = require('bcryptjs');
const Login = require("../models/users");
//const { generateJWT } = require("../helpers/jwt");

const postFindUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await Login.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario no existe en la base de datos",
      });
    }
    
    res.json({
        ok: true,
        msg: 'El usuario fue encontrado',
        email,
        userid: user.id
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor contacte al administrador",
    });
  }

  
};

module.exports = { postFindUser };