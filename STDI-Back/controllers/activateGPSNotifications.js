const { response } = require("express");
const ProfileUserData = require("../models/profileUserData");
const Users = require("../models/users");

const postActivateGPSNotifications = async (req, res = response) => {
  const { username, sendNotifications } = req.body;

  //Este servicio es para actualizar el valor SendNotifications
  //Si llega como true se actualizará con ese valor en la base de datos
  //De igual manera si llega false

  //busco si el usuario ya tiene algún perfil creado
  const userExist = await Users.findOne({
    username: username.toLowerCase(),
  });

  //Buscamos el ID del profile al cual se quiere linkear
  const profileID = userExist._id;

  //busco los datos del perfil del usuario
  const userProfileDataExist = await ProfileUserData.findOne({
    userid: profileID,
  });

  /*Este objeto tiene el body el cual hemos alterado según las validaciones correspondientes
  y el ID del usuario en el perfil*/
  const newProfileData = {
    socialMedia: userProfileDataExist.socialMedia,
    profileFullName: userProfileDataExist.profileFullName,
    profileBio: userProfileDataExist.profileBio,
    sendNotifications: sendNotifications,
    base64ProfilePhoto: userProfileDataExist.base64ProfilePhoto,
    base64BannerPhoto: userProfileDataExist.base64BannerPhoto,
    isLinked: userProfileDataExist.isLinked,
    usernameLinked: userProfileDataExist.usernameLinked,
    //profileID, //Este id es el id del registro del perfil dentro de la coleccion profileuserdata
    updated_at: new Date()
  };

  const updateData = await ProfileUserData.findByIdAndUpdate(
    userProfileDataExist._id,
    newProfileData
  );

  if(updateData){
    return res.json({
      ok: true,
      oldData: updateData,
      newData: newProfileData,
      msg: "Profile has been updated succesfully.",
    });
  }else{
    return res.json({
      ok: false,
      msg: "An error occurred, please try again.",
    });
  }

  
};

module.exports = { postActivateGPSNotifications };
