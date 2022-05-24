const { Router } = require("express");
//const {check} = require('express-validator');
//const {InputsValidate} = require('../middlewares/field-validator');
const { validateJWT } = require("../middlewares/validate-jwt");
const router = Router();

//Servicio tiene que pasar por validación de JWT
router.use(validateJWT);

const {
  getProfileUserData,
} = require("../controllers/getProfileUserData");

/*Para que el cliente pueda guardar su profile*/
router.get(
  "/getProfileUserData",
  getProfileUserData
);

module.exports = router;
