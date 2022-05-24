const { Router } = require("express");
//const {check} = require('express-validator');
//const {InputsValidate} = require('../middlewares/field-validator');
const { validateJWT } = require("../middlewares/validate-jwt");
const router = Router();

// const multer  = require('multer');
// const upload = multer({dest: './uploads'});

//Servicio tiene que pasar por validación de JWT
router.use(validateJWT);

const {
    postDeleteCustomImageButton,
} = require("../controllers/deleteCustomImageButton");

/*Para que el cliente pueda guardar su profile*/
router.post(
  "/deleteCustomImageButton",
  postDeleteCustomImageButton
);

module.exports = router;
