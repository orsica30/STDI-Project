const { response } = require("express");
const { generateJWT } = require("../helpers/jwt");

const renewToken = async(req, res = response) => {
  const userid  = req.userid;
  const email = req.email;

  //Función para generar el nuevo token
  const token = await generateJWT(userid,email);

  res.json({
      ok: true,
      userid,
      email,
      token
  })

  
};

module.exports = { renewToken };
