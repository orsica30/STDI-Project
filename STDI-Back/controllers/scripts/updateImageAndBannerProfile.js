/*
* Con este script actualizamos los registros de la foto y el banner de los usuarios sin tener que hacerlo a  mano
*/

const { response } = require("express");
const userModel = require("../../models/users");
const profileUserDataModel = require("../../models/profileUserData");
const { uploadFile } = require("../../helpers/uploadFile");

const updateImageAndBannerProfile = async (req, res = response) => {

    /*Recibimos el requesy y extramos del body el usuario, la carpeta y la key*/
    const body = { ...req.body }
    const {username} = body;
    console.log(body);

    /*Validamos que el usuario exista por el username*/
    const user = await userModel.findOne({ username });
    if(!user)
    return res.status(400).json({
        ok: false,
        msg: "Usuario no encontrado!",
    });

    /*Por medio del ID, buscamos el perfil el cual vamos a actualizar la foto de perfil y banner, Validamos quee xista el perfil*/
    const { _id } = user;
    const profileUserData = await profileUserDataModel.findOne({ userid: _id  });
    if(!profileUserData) return res.status(400).json({
        ok: false,
        msg: "Perfil no encontrado!",
    });

    /*Foto o Banner adjuntados en el formData*/
    const files = req.files;

    console.log(files);

    /*De ser el perfil o el banner,  actualizamos el registro con la ruta username/subfolder/key - EJ:  miguelgarcia/profile/cae3c86f809230379bc4265bad81e97e*/
    let updateData = null;
    let newProfileData = null;
    let rslProfile = { key: ""};
    let rslBanner = { key: ""};

    if(Object.values(files).some(element => element !== null)){

        if(files.profile)
        {
            console.log("Subiendo profile...");
          rslProfile = await uploadFile({ 
            userFolder: user.username, //Nombre del usuario para colocarselo a la carpeta
            subFolder: 'profile', //Donde guardamos la foto de perfil
            file: files.profile[0] //Archivo a subir
          });
          console.log(rslProfile.key);
          console.log("Banner subido!");
        }

        if(files.banner)
        {
            console.log("Subiendo banner...");
          rslBanner = await uploadFile({ 
            userFolder: user.username, //Nombre del usuario para colocarselo a la carpeta
            subFolder: 'banner', //Donde guardamos la foto de perfil
            file: files.banner[0] //Archivo a subir
          });
          console.log(rslBanner.key);
          console.log("Banner subido!");
        }
    }

    newProfileData = {
        base64ProfilePhoto: `${rslProfile.key}`,
        base64BannerPhoto: `${rslBanner.key}`
    }

    updateData = await profileUserDataModel.findByIdAndUpdate(
        profileUserData._id,
        newProfileData
    )
   
    console.log("newData", newProfileData);

    return res.status(200).json({
        ok: true,
        newData: newProfileData,
        msg: "Registros actualizados correctamente!",
    });
}

module.exports = { updateImageAndBannerProfile };