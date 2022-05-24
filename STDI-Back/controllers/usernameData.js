const { response } = require("express");
const User = require("../models/users");
const ProfileUserData = require("../models/profileUserData");
const GalleryUser = require("../models/galleryUser");
const CustomImageUser = require("../models/customImageUser");
const serialnumbers = require("../models/serialnumbers");

const postUsernameData = async (req, res = response) => {
  try {
    //En este servicio recimos el usuario o el numero de serial.
    const { username } = req.body;
    var customImage = null;

    let extra = "";

    /*Buscamos el perfil del usuario por su username o por el serial, de no existir cualquiera de los dos, retornamos un mkensaje*/
    const userExist = await User.findOne({
      username: username.toString().toLowerCase(),
    });
    const serialNumberExist = await User.findOne({
      serialNumber: username.toString().toLowerCase(),
    });
    if (!userExist && !serialNumberExist) {
      // return res.status(401).json({
      //   ok: false,
      //   msg: "User does not exist.",
      // });

      /*De no existir el usuario por el username ni tampoco por el serial, buscamos directamente en la colección de seriales y le indicamos al usuario
      que el usuario no existe pero si el perfil*/
      const serialNumberExistInCollection = await serialnumbers.findOne({
        serialNumber: username.toString().toLowerCase() });
      if(serialNumberExistInCollection){
        return res.status(401).json({
          ok: false,
          msg: "User does not exist. But, the serial does exist.",
        });
      }
      /*De no existir el serial o el username en los usuarios y tampoco en las colecciones de seriales, retornamos que el usuario no existe*/
      else{
        return res.status(401).json({
          ok: false,
          msg: "User does not exist.",
        });
      }

    }
    //obtengo el ID del username escrito en la url, ya sea por el serial o el username
    const UserID =
      userExist && userExist.id
        ? userExist.id
        : serialNumberExist && serialNumberExist.id
        ? serialNumberExist.id
        : false;

    const userProfileDataExist = await ProfileUserData.findOne({
      userid: UserID,
    });

    if (!userProfileDataExist) {
      return res.status(404).json({
        ok: false,
        msg: "Error 404. User Profile wasn't found.",
      });
    }

    //Buscamos si el usuario se encuentra activo o no
    //const isActive = userExist.active;
    const isActive =
      userExist && userExist.active
        ? userExist.active
        : serialNumberExist && serialNumberExist.active
        ? serialNumberExist.active
        : false;
    console.log(isActive);

    const email =
      userExist && userExist.email
        ? userExist.email
        : serialNumberExist && serialNumberExist.email
        ? serialNumberExist.email
        : false;
    console.log(email);

    if (userProfileDataExist && isActive === false) {
      return res.status(404).json({
        ok: false,
        msg: "User is not active",
      });
    }

    //obtenemos el id del registro de su social media
    const profileUserDataID = userProfileDataExist._id;

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

      for (let i = 0; i < customImageExist.length; ++i) {
        // extract value from property
        extractedValue.push(customImageExist[i].customImageData[0]);
      }
      customImage = extractedValue;
    } else {
      customImage = null;
    }

    //const customImage = customImageExist ? customImageExist : null;

    if (userProfileDataExist && userProfileDataExist.isLinked) {
      const usernameLinked = userProfileDataExist.usernameLinked;

      /*Buscamos el perfil del usuario por su username o por el serial, de no existir cualquiera de los dos, retornamos un mkensaje*/
      const userExist2 = await User.findOne({
        username: usernameLinked.toString().toLowerCase(),
      });
      if (!userExist2) {
        return res.status(401).json({
          ok: false,
          msg: "User does not exist.",
        });
      }
      //obtengo el ID del username escrito en la url, ya sea por el serial o el username
      const UserID2 = userExist2 && userExist2.id ? userExist2.id : false;

      const userProfileDataExist2 = await ProfileUserData.findOne({
        userid: UserID2,
      });

      if (!userProfileDataExist2) {
        return res.status(404).json({
          ok: false,
          msg: "Error 404. User Profile wasn't found.",
        });
      }

      //Buscamos si el usuario se encuentra activo o no
      //const isActive = userExist.active;
      const isActive =
        userExist && userExist.active
          ? userExist.active
          : serialNumberExist && serialNumberExist.active
          ? serialNumberExist.active
          : false;
      console.log(isActive);

      const email =
        userExist && userExist.email
          ? userExist.email
          : serialNumberExist && serialNumberExist.email
          ? serialNumberExist.email
          : false;
      console.log(email);

      if (userProfileDataExist && isActive === false) {
        return res.status(404).json({
          ok: false,
          msg: "User is not active",
        });
      }

      //buscamos en el modelo gallery si existe,
    //Si existe lo devuelvo en los datos del username
    //si no lo envío null
    const galleryExist = await GalleryUser.findOne({
      profileuserdataid: userProfileDataExist2._id,
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
      profileuserdataid: userProfileDataExist2._id,
    });

    if (customImageExist.length > 0) {
      let extractedValue = [];

      for (let i = 0; i < customImageExist.length; ++i) {
        // extract value from property
        extractedValue.push(customImageExist[i].customImageData[0]);
      }
      customImage = extractedValue;
    } else {
      customImage = null;
    }

      res.json({
        ok: true,
        data: userProfileDataExist2,
        active: isActive,
        email,
        username: usernameLinked,
        gallery,
        customImage,
        msg: "Username Profile Data found.",
      });
    } else {
      res.json({
        ok: true,
        data: userProfileDataExist,
        active: isActive,
        email,
        username: !serialNumberExist ? username : serialNumberExist.username,
        gallery,
        customImage,
        msg: "Username Profile Data found.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor contacte al administrador",
    });
  }
};

module.exports = { postUsernameData };
