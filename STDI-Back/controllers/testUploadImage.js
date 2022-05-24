const { response } = require("express");
const { uploadFile } = require("../helpers/uploadFile");

//Declaramos los modelos requeridos para agregar las columnas.
const USER = require("../models/users");
const serialnumbers = require("../models/serialnumbers");
const profileUsers = require("../models/profileUserData");
const galleryUser = require("../models/galleryUser");
const customImageUser = require("../models/customImageUser");


const postTestUploadImage = async (req, res = response) => {

    // const file = req.file;

    // console.log(req.file);

    // const params = {
    //     userFolder: "miguelgarcia",
    //     subFolder: "gallery",
    //     file
    // }

    // //const result = await uploadFile(params);

    // //console.log(result);

    // return res.status(200).json({
    //     ok: true,
    //     msg: "Servicio de prueba de imagenes creado!",
    // });

    const UserUpdate = await USER.updateMany([
      {
        $set: {
          created_at: new Date(),
          updated_at: null,
          deleted_at: null
        }
      }
    ])

    const serialUnumnbersUpdate = await serialnumbers.updateMany([
      {
        $set: {
          created_at: new Date(),
          updated_at: null,
          deleted_at: null
        }
      }
    ])

    const profileUsersUpdate = await profileUsers.updateMany([
      {
        $set: {
          created_at: new Date(),
          updated_at: null,
          deleted_at: null
        }
      }
    ])

    const galleryUserUpdate = await galleryUser.updateMany([
      {
        $set: {
          created_at: new Date(),
          updated_at: null,
          deleted_at: null
        }
      }
    ]);

    const customImageUserUpdate = await customImageUser.updateMany([
      {
        $set: {
          created_at: new Date(),
          updated_at: null,
          deleted_at: null
        }
      }
    ]);

    if(UserUpdate && serialUnumnbersUpdate && profileUsersUpdate && galleryUserUpdate && customImageUserUpdate)
    {
      return res.status(200).json({
          ok: true,
          msg: "Columnas created_at, updated_at y deleted_at agreadas con éxito!",
      });
    }
}

module.exports = { postTestUploadImage };