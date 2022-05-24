const { response } = require("express");
//var ObjectId = require("mongodb").ObjectId;

/*Modelos DB*/
const ProfileUserData = require("../models/profileUserData");
const USER = require("../models/users");
const CustomImageUser = require("../models/customImageUser");
var CryptoJS = require("crypto-js");

/*Helpers:*/
//const { uploadFile } = require("../helpers/uploadFile");
//const { deleteFolderInsideBucket } = require("../helpers/deleteFolderInsideBucket");

const postDeleteCustomImageButton = async (req, res = response) => {
  const { idCustomImage } = req.body;

  var bytes = CryptoJS.AES.decrypt(idCustomImage, "Ll@veSeCRet@123.-");
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  var customImage = null;

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

  //Guardamos el ID del registro del perfil del usuario
  const profileUserDataID = userProfile._id;

  //buscamos el custom Image button a eliminar
  const deleteCustomImageButton = await CustomImageUser.findByIdAndDelete({
      _id: decryptedData
  });

  //si el registro fue eliminado correctamente
  //entonces devolvemos un ok true y un arreglo con los
  //Custom button que le quedan al usuario
  //para pintarlos en la vista, en tal caso que quiera seguir viendo
  if (deleteCustomImageButton) {

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

      
    return res.json({
      ok: true,
      msg: "Custom Image Button was removed succesfully",
      customImage
    });
  }else{
    return res.json({
        ok: false,
        msg: "Please try again!",
      });
  }

  
};

module.exports = { postDeleteCustomImageButton };
