const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");

const app = express();

/*Base de datos*/
dbConnection();

//Uso de CORS
app.use(cors());

//Directorio público, usando use() Middleware
app.use(express.static("public"));

//Lectira y parseo del body
app.use(express.json({ limit: '200mb' }));

//Rutas
/* Servicios que NO requieren JWT*/
app.use("/api/email", require("./routes/testEmail")); //Test email genérico
app.use("/api/email", require("./routes/sendNotification")); //Test email genérico
app.use("/api/auth", require("./routes/auth")); //Rutas referentes a login
app.use("/api/auth", require("./routes/forgotPassword")); //Olvidar contraseña
app.use("/api/users", require("./routes/saveNewUser")); //Rutas referentes a crear usuarios
app.use("/api/users", require("./routes/usernameData")); //Get Data del perfil del usuario con request username
app.use("/api/users", require("./routes/activateLinkingProfile")); //Activar el link Profile de un usuario
app.use("/api/serialnumbers", require("./routes/saveNewSerialNumber")); //Rutas referentes a crear usuarios
app.use("/api/render", require("./routes/getRenderImage"));
app.use("/api/users", require("./routes/testUploadImage"));

/*Scripts para interactuar con la DB:*/
app.use("/api/scripts", require("./routes/scripts/updateImageAndBannerProfile")); //POST para editar la imagen y el banner del perfil de un usuario

/* Servicios que SI requieren JWT*/
app.use("/api/auth", require("./routes/renewToken")); //Rutas referentes a renovación de Token
app.use("/api/auth", require("./routes/changePassword")); //Cambiar contraseña
app.use("/api/users", require("./routes/linkingProfile")); //Conectar a perfil ya existente
app.use("/api/users", require("./routes/activateGPSNotifications")); //Cambiar status de SendNotifications (true o false)
app.use("/api/users", require("./routes/findUser")); //Rutas referentes a encontrar usuarios
app.use("/api/users", require("./routes/activateGallery")); //Activar o desactivar la galería
app.use("/api/users", require("./routes/saveNewGallery")); //Guardar Nueva Galería de Imágenes
app.use("/api/users", require("./routes/updateGallery")); //Modificar Galería de Imágenes
app.use("/api/users", require("./routes/saveNewCustomImage")); //Guardar Nueva Custom Image
app.use("/api/users", require("./routes/deleteCustomImageButton")); //Eliminar Custom Image Button
app.use("/api/users", require("./routes/saveProfileUserData")); //Guardar info perfil
app.use("/api/users", require("./routes/updateProfileUserData")); //Actualizar info perfil
app.use("/api/users", require("./routes/getProfileUserData")); //Obtener info perfil
app.listen(process.env.PORT, () => {
  console.log(`Server is runing, port: ${process.env.PORT}`);
});
