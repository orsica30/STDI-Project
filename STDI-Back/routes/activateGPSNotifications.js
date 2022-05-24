/* Ruta de Usuario/Auth
    host + /api/auth
*/

const {Router} = require('express');
//const {check} = require('express-validator');
//const {InputsValidate} = require('../middlewares/field-validator');
const router = Router();

const { postActivateGPSNotifications } = require('../controllers/activateGPSNotifications');

/*Para que el cliente pueda loguear*/
router.post('/activateGPSNotifications',
    [ //middlewares
        //check('email', 'El correo de acceso es obligatorio').not().isEmpty(), //Validación sí envían null, "", undefined o no veían nada
        //InputsValidate
    ],
    postActivateGPSNotifications
);

module.exports = router;