const { Router } = require("express");
//const {check} = require('express-validator');
//const {InputsValidate} = require('../middlewares/field-validator');
const { validateJWT } = require("../middlewares/validate-jwt");
const router = Router();

const multer  = require('multer');
const upload = multer({dest: './tmp/uploads'});

//Servicio tiene que pasar por validación de JWT
router.use(validateJWT);

const {
  postUpdateProfileUserData,
} = require("../controllers/updateProfileUserData");

/*Para que el cliente pueda guardar su profile*/
router.post(
  "/updateProfileUserData",
  upload.fields([
    { name: 'base64ProfilePhoto', maxCount: 1 },
    { name: 'base64BannerPhoto', maxCount: 1 }
  ]),
  postUpdateProfileUserData
);

module.exports = router;