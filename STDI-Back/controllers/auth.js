const { response } = require("express");
const bcrypt = require("bcryptjs");
const Login = require("../models/users");
const { generateJWT } = require("../helpers/jwt");

const postLogin = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await Login.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Incorrect username or password",
      });
    }

    console.log(user);
    if (user && user.active === false) {
      return res.status(400).json({
        ok: false,
        msg: "User is not active",
      });
    }

    //Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Incorrect username or password.",
      });
    }

    //Si está todo ok pasa esto
    //Generar jwt token
    const token = await generateJWT(user.email, user.id);

    res.json({
      ok: true,
      msg: "login",
      email,
      username: user.username,
      name: user.name,
      userid: user.id,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please, contact this sites admin",
    });
  }
};

module.exports = { postLogin };
