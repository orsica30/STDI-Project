const { response } = require("express");
const Users = require("../models/users");
const ProfileUserData = require("../models/profileUserData");
var CryptoJS = require("crypto-js");

const postActivateLinkingProfile = async (req, res = response) => {
  const { usernameToActivateLink } = req.body;

  //Aquí realizo el proceso inverso, antes de desencriptar restauro el string original para mantener la integridad del dato enviado
  var originalData = usernameToActivateLink
    .replace(/p1L2u3S/g, "+")
    .replace(/s1L2a3S4h/g, "/")
    .replace(/e1Q2u3A4l/g, "=");

  console.log(originalData);

  var bytes = CryptoJS.AES.decrypt(originalData, "Ll@veSeCRet@123.-");

  console.log(bytes);

  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  //busco si el usuario ya tiene algún perfil creado
  const userExist = await Users.findOne({
    username: decryptedData.toLowerCase(),
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
    isLinked: true,
    usernameLinked: userProfileDataExist.usernameLinked,
    //profileID, //Este id es el id del registro del perfil dentro de la coleccion profileuserdata
  };

  const updateData = await ProfileUserData.findByIdAndUpdate(
    userProfileDataExist._id,
    newProfileData
  );

  if (updateData) {
    return res.json({
      ok: true,
      // oldData: updateData,
      // newData: newProfileData,
      msg: "Linked profile enabled succesfully",
    });
  } else {
    return res.json({
      ok: false,
      msg: "Profile couldn't be linked",
    });
  }
};

module.exports = { postActivateLinkingProfile };
