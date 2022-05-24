const { response } = require("express");
//var ObjectId = require("mongodb").ObjectId;

/*Modelos DB*/
const ProfileUserData = require("../models/profileUserData");
const USER = require("../models/users");
const CustomImageUser = require("../models/customImageUser");
var CryptoJS = require("crypto-js");

/*Helpers:*/
const { uploadFile } = require("../helpers/uploadFile");

const postSaveNewCustomImage = async (req, res = response) => {
  const files = req.files;
  var customImage = null;
  const { customImageActive, customImageButtonName } = req.body;

  //Con el formData, se está recibiendo el true como String
  //con esta comparación lo pasamos a tipo Boolean
  const customImageActiveToBoolean = (customImageActive === "true") ? true : false;

  console.log(files);

  //primero validamos que el user exista
  const user = await USER.findOne({ _id: req.userid });

  if (!user) {
    return res.status(404).json({
      ok: false,
      msg: "User not found",
    });
  }

  //Si pasa la validación entonces guardamos el ID del user
  const userID = user._id;

  //Luego validamos que este id esté dentro de un profileUserData
  const userProfile = await ProfileUserData.findOne({ userid: userID });

  if (!userProfile) {
    return res.status(404).json({
      ok: false,
      msg: "User found but whithout Profile Data saved.",
    });
  }

  const userProfileID = userProfile._id;

  if (files.customImage == undefined) {
    res.status(404).json({
      ok: false,
      msg: "Should pick at least one photo",
    });
  }

  /*Validamos que hayan sido adjuntado una foto de perfil o banner*/
  if (Object.values(files).some((element) => element !== null)) {
    let rslGallery = "";
    let arrayWithImagesURL = [];

    const filesArrayLength = files.customImage.length;

    if (files.customImage) {
      //Recorremos el arreglo gallery
      for (let index = 0; index < filesArrayLength; index++) {
        rslGallery = await uploadFile({
          userFolder: user.username, //Nombre del usuario para colocarselo a la carpeta
          subFolder: "customImage", //Donde guardamos la foto de perfil
          file: files.customImage[index], //Archivo a subir
        });

        //guardamos las diferentes urls de los archivos adjuntados
        arrayWithImagesURL.push({ image: rslGallery.key });
      }

      if (!rslGallery.key) {
        return res.status(502).json({
          ok: false,
          msg: "There was a problem uploading the profile picture.",
        });
      }

      //Procedemos a guardar los datos de la galería
      const newCustomImage = new CustomImageUser({
        customImageData: {
          arrayWithImagesURL,
          customImageActive: customImageActiveToBoolean,
          customImageButtonName,
        },
        profileuserdataid: userProfileID,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      });

      const saveNewCustomImage = await newCustomImage.save();

      if (saveNewCustomImage) {
        //buscamos en el modelo customimageuser si existe,
    //Si existe lo devuelvo en los datos del username
    //si no lo envío null
    const customImageExist = await CustomImageUser.find({
      profileuserdataid: userProfileID,
    });

    if (customImageExist.length > 0) {
      let extractedValue = [];
      let extractedId = [];
      let arrayWithExtractedValuesAndIds = [];

      for (let i = 0; i < customImageExist.length; ++i) {
        // extract value from property
        extractedValue.push(customImageExist[i].customImageData[0]);        
        var ciphertext = CryptoJS.AES.encrypt(
          JSON.stringify(customImageExist[i]._id),
          "Ll@veSeCRet@123.-"
        ).toString();
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

        res.status(201).json({
          ok: true,
          event: saveNewCustomImage,
          customImage,
          msg: "Custom Image created succesfully.",
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: "Custom Image can't be saved, please try again.",
        });
      }
    } else {
      /*Sí no fue adjuntada la foto de perfil, mandamos un ok false*/

      res.status(404).json({
        ok: false,
        msg: "Should pick at least one photo 2.",
      });
    }
  }
};

module.exports = { postSaveNewCustomImage };
