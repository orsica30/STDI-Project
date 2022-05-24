const { response } = require("express");
var ObjectId = require("mongodb").ObjectId;
//const bcrypt = require('bcryptjs');

/*Modelos DB*/
const ProfileUserData = require("../models/profileUserData");
const USER = require("../models/users");

/*Helpers:*/
const { uploadFile } = require("../helpers/uploadFile");

const postSaveProfileUserData = async (req, res = response) => {

  const body = { ...req.body}

  const profile = new ProfileUserData(body);

  const socialMedia = JSON.parse(body.socialMedia);

  try {

    //Aquí obtenemos el id del usuario que está logeado a través del token JWT
    profile.userid = req.userid;

    const userID = req.userid; //Declaro el userid en una variable

    //busco si el usuario ya tiene algún perfil creado
    const userExist = await ProfileUserData.findOne({ "userid": userID });

    const user = await USER.findOne({ email: req.email });

    /*Validamos que el perfil o el usuario no existan.*/
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    //Si tiene perfil creado, guardarn´t
    if (userExist) {
      return res.status(400).json({
        ok: false,
        msg: "User has already a profile registered."
      });
    }

    const files = req.files;
    
    /*Validamos que hayan sido adjuntado una foto de perfil o banner*/
    if(Object.values(files).some(element => element !== null))
    {

      let rslProfile = "";
      let rslBanner = "";

      if(files.base64ProfilePhoto)
      {
        rslProfile = await uploadFile({ 
          userFolder: user.username, //Nombre del usuario para colocarselo a la carpeta
          subFolder: 'profile', //Donde guardamos la foto de perfil
          file: files.base64ProfilePhoto[0] //Archivo a subir
        });

        if(!rslProfile.key){
          return res.status(502).json({
            ok: false,
            msg: "There was a problem uploading the profile picture."
          }); 
        }
      }
      /*Sí no fue adjuntada la foto de perfil, seteamos lo que ya tenía en el perfil*/
      else{
        rslProfile = {
          key: ""
        }
      }

      if(files.base64BannerPhoto){
        rslBanner = await uploadFile({ 
          userFolder: user.username, //Nombre del usuario para colocarselo a la carpeta
          subFolder: 'banner', //Donde el banner
          file: files.base64BannerPhoto[0] //Archivo a subir
        }); 
        
        if(!rslBanner.key){
          return res.status(502).json({
            ok: false,
            msg: "There was a problem uploading the banner picture."
          }); 
        }
      }
      /*De no ser adjuntado el bannner, dejamos lo que ya tenía en el perfil.*/
      else{
        rslBanner = {
          key: ""
        }
      }

      profile.base64ProfilePhoto = rslProfile.key ? rslProfile.key : "";
      profile.base64BannerPhoto = rslBanner.key ? rslBanner.key : "";
      profile.socialMedia = socialMedia ? socialMedia : [];
      profile.creaed_at = new Date();
      profile.updated_at = null;
      profile.deleted_at = null;
    }

    console.log("profile:::::", profile);

    const saveProfile = await profile.save();
    
    res.status(201).json({
      ok: true,
      event: saveProfile,
      msg: "Profile was created succesfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor contacte al administrador",
    });
  }
};

module.exports = { postSaveProfileUserData };
