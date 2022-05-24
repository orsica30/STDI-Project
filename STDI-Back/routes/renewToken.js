/* Ruta de Usuario/Auth
    host + /api/auth
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {InputsValidate} = require('../middlewares/field-validator');
const {validateJWT} = require('../middlewares/validate-jwt');
const router = Router();

const { renewToken } = require('../controllers/renewToken');

/*Para que el cliente pueda loguear*/
router.get('/renewToken', validateJWT, renewToken);

module.exports = router;