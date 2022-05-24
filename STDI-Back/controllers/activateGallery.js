const { response } = require("express");
const ProfileUserData = require("../models/profileUserData");
const Users = require("../models/users");
const Gallery = require("../models/galleryUser");
const galleryUser = require("../models/galleryUser");

const postActivateGallery = async (req, res = response) => {
  const { galleryActive } = req.body;
  const userID = req.userid;

  //Este servicio es para actualizar el valor galleryActive
  //Si llega como true se actualizará con ese valor en la base de datos
  //De igual manera si llega false

  //busco si el usuario ya tiene algún perfil creado
  const userExist = await Users.findOne({
    _id: userID,
  });

  if (!userExist) {
    return res.json({
      ok: false,
      msg: "User not found.",
    });
  }

  //Buscamos el ID del profile al cual se quiere linkear
  const profileID = userExist._id;

  //busco los datos del perfil del usuario
  const userProfileDataExist = await ProfileUserData.findOne({
    userid: profileID,
  });

  if (!userProfileDataExist) {
    return res.json({
      ok: false,
      msg: "User Profile Data not found.",
    });
  }

  const userProfileDataID = userProfileDataExist._id;

  //buscamos si el usuario tiene alguna galería registrada
  const galleryExist = await galleryUser.findOne({
    profileuserdataid: userProfileDataID,
  });

  if (!galleryExist) {
    return res.json({
      ok: false,
      msg: "Gallery not found.",
    });
  }

  const arrayGalleryImages = galleryExist.galleryImages;

  const newGallery = {
    arrayGalleryImages,
    galleryActive,
    updated_at: new Date()
  };

  const updateGallery = await galleryUser.findByIdAndUpdate(
    galleryExist._id,
    newGallery
  );

  if (updateGallery) {
    return res.json({
      ok: true,
      oldData: updateGallery,
      newData: newGallery,
      msg: "Gallery has been updated succesfully.",
    });
  } else {
    return res.json({
      ok: false,
      msg: "An error occurred, please try again.",
    });
  }
};

module.exports = { postActivateGallery };
