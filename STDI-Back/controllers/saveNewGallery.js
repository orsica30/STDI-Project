const { response } = require("express");
//var ObjectId = require("mongodb").ObjectId;

/*Modelos DB*/
const ProfileUserData = require("../models/profileUserData");
const USER = require("../models/users");
const Gallery = require("../models/galleryUser");

/*Helpers:*/
const { uploadFile } = require("../helpers/uploadFile");

const postSaveNewGallery = async (req, res = response) => {
  const files = req.files;
  const { galleryActive, galleryURL  } = req.body;

  console.log(files);
  console.log("Este es el galleryURL-->",galleryURL);
  console.log("isArray-->", Array.isArray(galleryURL));

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

  if(files.galleryImages == undefined){
    res.status(404).json({
      ok: false,
      msg: "Should pick at least one photo",
    });
  }

  /*Validamos que hayan sido adjuntado una foto de perfil o banner*/
  if (Object.values(files).some((element) => element !== null)) {
    let rslGallery = "";
    let arrayWithImagesURL = [];

    const filesArrayLength = files.galleryImages.length;

    if (files.galleryImages) {

      //Recorremos el arreglo gallery
      for (let index = 0; index < filesArrayLength ; index++) {
        rslGallery = await uploadFile({
          userFolder: user.username, //Nombre del usuario para colocarselo a la carpeta
          subFolder: "gallery", //Donde guardamos la foto de perfil
          file: files.galleryImages[index], //Archivo a subir
        });

        //guardamos las diferentes urls de los archivos adjuntados
        //Aquí comparo si el galleryURL es un array o no, si es un array voy seteando sus elementos según su posición
        //Si no, le mando su único valor, esto se hace debido a que si seleccionan solo un elemento a subir en la galeria
        //no lo recibe como un array de length 1 sino como una variable normal
        arrayWithImagesURL.push({ image: rslGallery.key, url: Array.isArray(galleryURL) ? galleryURL[index] : galleryURL});
      }
      

      if (!rslGallery.key) {
        return res.status(502).json({
          ok: false,
          msg: "There was a problem uploading the profile picture.",
        });
      }

      //Procedemos a guardar los datos de la galería
      const newGallery = new Gallery({
        galleryImages: arrayWithImagesURL,
        galleryActive: galleryActive === "true" ? true : false,
        profileuserdataid: userProfileID,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      });

      const saveNewGallery = await newGallery.save();

      if (saveNewGallery) {
        res.status(201).json({
          ok: true,
          event: saveNewGallery,
          msg: "Gallery created succesfully.",
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: "Gallery can't be saved, please try again.",
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

module.exports = { postSaveNewGallery };
