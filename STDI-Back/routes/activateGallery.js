const {Router} = require('express');
const {check} = require('express-validator');
const {InputsValidate} = require('../middlewares/field-validator');
const {validateJWT} = require('../middlewares/validate-jwt');
const router = Router();

const { postActivateGallery} = require('../controllers/activateGallery');

/*Para que el cliente pueda loguear*/
router.post('/activateGallery', validateJWT, postActivateGallery);

module.exports = router;