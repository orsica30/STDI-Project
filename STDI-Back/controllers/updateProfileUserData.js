const { response } = require("express");
const ProfileUserData = require("../models/profileUserData");
const { uploadFile } = require("../helpers/uploadFile");
const USER = require("../models/users");

const postUpdateProfileUserData = async (req, res = response) => {

  const body = { ...req.body }
  /*Incializamos las propiedades (fechas) en el objeto
  ya que en el body eso no lo manejamos*/
  body.updated_at = new Date();

  /*Parseamos el arreglo de objetos de las redes sociales ya que viene con un string. 
  Esto lo hacemos para guardarlo en su formato correspondiente.*/
  const socialMedia = JSON.parse(body.socialMedia);

  try {
    //Aquí obtenemos el id del usuario que está logeado a través del token JWT
    //profile.userid = req.userid;

    const userID = req.userid; //Declaro el userid en una variable

    //busco si el usuario ya tiene algún perfil creado
    const userExist = await ProfileUserData.findOne({ userid: userID });

    const user = await USER.findOne({ email: req.email });

    /*Validamos que el perfil o el usuario no existan.*/
    if (!userExist && !user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    /*Foto o Banner adjuntados en el formData*/
    const files = req.files;

    /*Seteamos los valores del perfil y el banner que ya tenía el usuario. Ya sea "" o la ruta*/
    const { base64ProfilePhoto, base64BannerPhoto } = userExist;

    /*Validamos que se adjuntaron archivos a subir (foto de perfil o banner)*/
    if(Object.values(files).some(element => element !== null)){

      let rslProfile = "";
      let rslBanner = "";

      /*Validamos que haya sido adjuntada una imagen de perfil*/
      if(files.base64ProfilePhoto)
      {
        rslProfile = await uploadFile({ 
          userFolder: user.username, //Nombre del usuario para colocarselo a la carpeta
          subFolder: 'profile', //Donde guardamos la foto de perfil
          file: files.base64ProfilePhoto[0] //Archivo a subir
        });
      }
      /*Sí no fue adjuntada la foto de perfil, seteamos lo que ya tenía en el perfil*/
      else{
        rslProfile = {
          key: base64ProfilePhoto
        }
      }

      /*Validamos que se haya adjuntado una imagen para el banner*/
      if(files.base64BannerPhoto){
        rslBanner = await uploadFile({ 
          userFolder: user.username, //Nombre del usuario para colocarselo a la carpeta
          subFolder: 'banner', //Donde el banner
          file: files.base64BannerPhoto[0] //Archivo a subir
        });        
      }
      /*De no ser adjuntado el bannner, dejamos lo que ya tenía en el perfil.*/
      else{
        rslBanner = {
          key: base64BannerPhoto
        }
      }

      /*Obtemos de cada resultado asincrono la key para setearla en el body y actualizar registros*/
      const bodyWitValues = setValuesToBody(body, rslProfile.key, rslBanner.key, socialMedia);
      await saveUpdateData(res, userExist, bodyWitValues);
    }
    else{

      /*En caso de no ser adjuntados archivos (foto o banner) le seteamos los valores que ya tenía, 
      ya sea "" o la ruta del archivo en s3. También le seteamos las redes sociales*/
      const bodyWitValues = setValuesToBody(body, base64ProfilePhoto, base64BannerPhoto, socialMedia);
      await saveUpdateData(res, userExist, bodyWitValues);
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor contacte al administrador",
    });
  }
};

/*Con esta función seteamos la ruta de la foto de perfil, el banner y las redes sociales (convertidas a JSON).
* La función retorna el body para guardarlo en el object Mongo.
*/
const setValuesToBody = (body, keyProfile, keyBanner, socialMedia) => {
  body.base64ProfilePhoto = keyProfile ? keyProfile : "";
  body.base64BannerPhoto = keyBanner ? keyBanner : "";
  body.socialMedia = socialMedia ? socialMedia : [];
  return body;
}

/* Con esta función actualizados los datos del modelo en la DB.
*/
const saveUpdateData = async (res, userExist, body) => {

  const profileID = userExist._id;

  /*Este objeto tiene el body el cual hemos alterado según las validaciones correspondientes
  y el ID del usuario en el perfil*/
  const newProfileData = {
    ...body,
    profileID, //Este id es el id del registro del perfil dentro de la coleccion profileuserdata
  };

  //buscamos el id dentro de la colección y modifica con la data nueva
  const updateData = await ProfileUserData.findByIdAndUpdate(
    profileID,
    newProfileData
  );

  return res.json({
    ok: true,
    oldData: updateData,
    newData: newProfileData,
    msg: "Profile has been updated succesfully.",
  });

}

module.exports = { postUpdateProfileUserData };
