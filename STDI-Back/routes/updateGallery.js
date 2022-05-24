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
  postUpdateGallery,
} = require("../controllers/updateGallery");

/*Para que el cliente pueda guardar su profile*/
router.post(
  "/updateGallery",
  upload.fields([
    { name: 'galleryImages', maxCount: 5 },
  ]),
  postUpdateGallery
);

module.exports = router;