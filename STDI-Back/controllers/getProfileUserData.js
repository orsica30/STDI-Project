const { response } = require("express");
var ObjectId = require("mongodb").ObjectId;
//const bcrypt = require('bcryptjs');
const ProfileUserData = require("../models/profileUserData");
const Users = require("../models/users");
const GalleryUser = require("../models/galleryUser");
const CustomImageUser = require("../models/customImageUser");
var CryptoJS = require("crypto-js");


const getProfileUserData = async (req, res = response) => {
  //const profile = new ProfileUserData(req.body);
  var customImage = null;

  try {
    //Aquí obtenemos el id del usuario que está logeado a través del token JWT
    //profile.userid = req.userid;

    const userID = req.userid; //Declaro el userid en una variable
    const email = req.email;

    console.log(userID);

    //busco si el usuario ya tiene algún perfil creado
    const userExist = await Users.findOne({ email: email.toLowerCase() });

    //Primero lo voy a buscar en colección users a ver si existe el registro
    //Si no encuentra un usuario, devuelve un 404
    if (!userExist) {
      return res.status(404).json({
        ok: false,
        msg: "User not found.",
      });
    }

    //Si el usuario existe, voy a ir a buscar su perfil
    //En caso de que no exista, retorno un 404 con el valor del username
    //Lo necesitamos en la vista para el edit-profile
    const userExist2 = await ProfileUserData.findOne({ userid: userID });

    if (!userExist2) {
      return res.json({
        ok: true,
        msg: "User is registered but doesn't have any profile saved.",
        username: userExist.username,
        serialNumber: userExist.serialNumber,
        email: userExist.email,
        name: userExist.name,
        data: null,
        gallery: null,
        customImage: null,
      });
    }

    const profileUserDataID = userExist2._id;

    //buscamos en el modelo gallery si existe,
    //Si existe lo devuelvo en los datos del username
    //si no lo envío null
    const galleryExist = await GalleryUser.findOne({
      profileuserdataid: profileUserDataID,
    });

    const gallery = galleryExist
      ? {
          galleryImages: galleryExist.galleryImages,
          galleryActive: galleryExist.galleryActive,
        }
      : null;

    //buscamos en el modelo customimageuser si existe,
    //Si existe lo devuelvo en los datos del username
    //si no lo envío null
    const customImageExist = await CustomImageUser.find({
      profileuserdataid: profileUserDataID,
    });

    if (customImageExist.length > 0) {
      let extractedValue = [];
      let extractedId = [];
      let arrayWithExtractedValuesAndIds = [];

      for (let i = 0; i < customImageExist.length; ++i) {
        // extract value from property
        extractedValue.push(customImageExist[i].customImageData[0]);

        //Encriptamos el id a pasar en el servicio
        let idCustomImageExistent = customImageExist[i]._id;
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(idCustomImageExistent), "Ll@veSeCRet@123.-").toString();
        extractedId.push(ciphertext);
      }

      for (let j = 0; j < customImageExist.length; ++j) {
        // extract value from property
        arrayWithExtractedValuesAndIds.push({
          arrayWithImagesURL: extractedValue[j].arrayWithImagesURL,
          customImageActive: extractedValue[j].customImageActive,
          customImageButtonName: extractedValue[j].customImageButtonName,
          idCustomImageButton: extractedId[j],
        });
      }
      customImage = arrayWithExtractedValuesAndIds;
    } else {
      customImage = null;
    }

    res.status(200).json({
      ok: true,
      data: userExist2,
      username: userExist.username,
      email: userExist.email,
      serialNumber: userExist.serialNumber,
      name: userExist.name,
      gallery,
      customImage,
      msg: "User data found.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor contacte al administrador",
    });
  }
};

module.exports = { getProfileUserData };
