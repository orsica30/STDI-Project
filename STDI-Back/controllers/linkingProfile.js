const { response } = require("express");
const ProfileUserData = require("../models/profileUserData");
const Users = require("../models/users");
const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
var CryptoJS = require("crypto-js");

const postLinkingProfile = async (req, res = response) => {
  const { username, isLinked, usernameLinked } = req.body;

  //Este servicio es transversal, si isLinked llega como true
  //actualizará la data con el usernameLinked
  //Si llega como false, pondrá isLinked dentro de los datos
  //del perfil del usuario como false y username vacío
  if (isLinked) {
    //El username nunca puede ser igual al usernameLinked
    if (username === usernameLinked) {
      return res.json({
        ok: false,
        msg: "Username to be linked with can't be this username profile.",
      });
    }

    //busco si el usuario ya tiene algún perfil creado
    const userExist = await Users.findOne({
      username: username.toLowerCase(),
    });

    //Si el username al que se quiere linkear no existe devuelvo un 404
    if (!userExist) {
      return res.json({
        ok: false,
        msg: "User non existent.",
      });
    }

    //busco si el usuario al cual se quiere linkear ya tiene algún perfil creado
    const userToLinkExist = await Users.findOne({
      username: usernameLinked.toLowerCase(),
    });

    //Si el username al que se quiere linkear no existe devuelvo un 404
    if (!userToLinkExist) {
      return res.json({
        ok: false,
        msg: "User to be linked non existent.",
      });
    }

    //Si pasa las validaciones entonces dejo modificar los datos
    //Buscamos el ID del profile al cual se quiere linkear
    const profileID = userExist._id;

    //busco los datos del perfil del usuario
    const userProfileDataExist = await ProfileUserData.findOne({
      userid: profileID,
    });

    if (!userProfileDataExist) {
      return res.json({
        ok: false,
        msg: "Profile without socialMedia data saved.",
      });
    }

    /*Este objeto tiene el body el cual hemos alterado según las validaciones correspondientes
  y el ID del usuario en el perfil*/
    const newProfileData = {
      socialMedia: userProfileDataExist.socialMedia,
      profileFullName: userProfileDataExist.profileFullName,
      profileBio: userProfileDataExist.profileBio,
      sendNotifications: userProfileDataExist.sendNotifications,
      base64ProfilePhoto: userProfileDataExist.base64ProfilePhoto,
      base64BannerPhoto: userProfileDataExist.base64BannerPhoto,
      isLinked: false,
      usernameLinked: usernameLinked,
      //profileID, //Este id es el id del registro del perfil dentro de la coleccion profileuserdata
      updated_at: new Date(),
    };

    const updateData = await ProfileUserData.findByIdAndUpdate(
      userProfileDataExist._id,
      newProfileData
    );

    if (updateData) {
      //Dato a proteger a través de la encriptacion
      //Voy a enviar encriptado el username al cual se va a linkear
      //Al llegar al front se le pegará a otro servicio que leerá este dato desencriptado
      //Voy a buscar el dato isLinked en su colección profileUserdata y
      //Modificar el dato isLinked a un true para completar la activación
      const usernameToBeLinked = userExist.username;

      var ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(usernameToBeLinked),
        "Ll@veSeCRet@123.-"
      ).toString();

      //Aquí lo que se hace es reemplazar los símbolos en la cadena de texto ciphertext
      //se reemplazantodos los símbolos (+,= y /)
      //así podemos pasar por url el string hasheado sin / ya que react lo está leyendo como una ubicación nueva
      var ciphertextWithoutSymbols = ciphertext
        .replace(/\+/g, "p1L2u3S")
        .replace(/\//g, "s1L2a3S4h")
        .replace(/=/g, "e1Q2u3A4l");

      console.log(ciphertext);
      console.log(ciphertextWithoutSymbols);

      //variables del correo a enviar
      //Aquí enviamos el correo para pedir permiso al dueño de la cuenta al cual se quiere linkear
      const msg = {
        to: userToLinkExist.email,
        from: "info@stdicompany.com",
        subject:
          "A STDI User is expecting your permission to link its profile with you",
        //text: "Welcome to STDI Company",
        html:
          "Hi," +
          "<b> a STDI User is expecting your permission to link its profile with you</b>" +
          " <a href='http://localhost:3000/activateLinkedProfile/" +
          ciphertextWithoutSymbols +
          "'>Click here to allow the permission</a>.",
      };

      await sendgridMail
        .send(msg)
        .then((response) => {
          console.log(response[0].statusCode);
          console.log(response[0].headers);
          return res.json({
            ok: true,
            oldData: updateData,
            newData: newProfileData,
            msg: "Profile has been updated succesfully, enabling the linked username.",
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
      res.status(500).json({
        ok: false,
        msg: "Data couldn't be updated.",
      });
    }
  } else {
    //busco si el usuario ya tiene algún perfil creado
    const userExist = await Users.findOne({
      username: username.toLowerCase(),
    });

    //Si el username al que se quiere linkear no existe devuelvo un 404
    if (!userExist) {
      return res.json({
        ok: false,
        msg: "User non existent.",
      });
    }

    //Si pasa las validaciones entonces dejo modificar los datos
    //Buscamos el ID del profile al cual se quiere linkear
    const profileID = userExist._id;
    console.log(profileID);

    //busco los datos del perfil del usuario
    const userProfileDataExist = await ProfileUserData.findOne({
      userid: profileID,
    });

    if (!userProfileDataExist) {
      return res.json({
        ok: false,
        msg: "Profile without socialMedia data saved.",
      });
    }

    /*Este objeto tiene el body el cual hemos alterado según las validaciones correspondientes
    y el ID del usuario en el perfil*/
    const newProfileData = {
      socialMedia: userProfileDataExist.socialMedia,
      profileFullName: userProfileDataExist.profileFullName,
      profileBio: userProfileDataExist.profileBio,
      sendNotifications: userProfileDataExist.sendNotifications,
      base64ProfilePhoto: userProfileDataExist.base64ProfilePhoto,
      base64BannerPhoto: userProfileDataExist.base64BannerPhoto,
      isLinked: false,
      usernameLinked: "",
      //profileID, //Este id es el id del registro del perfil dentro de la coleccion profileuserdata
      updated_at: new Date(),
    };

    const updateData = await ProfileUserData.findByIdAndUpdate(
      userProfileDataExist._id,
      newProfileData
    );

    return res.json({
      ok: true,
      oldData: updateData,
      newData: newProfileData,
      msg: "Profile has been updated succesfully, disabling the linked username.",
    });
  }
};

module.exports = { postLinkingProfile };
