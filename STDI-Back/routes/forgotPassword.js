const {Router} = require('express');
//const {check} = require('express-validator');
//const {InputsValidate} = require('../middlewares/field-validator');
const router = Router();

const { postForgotPassword } = require('../controllers/forgotPassword');

/*Para que el cliente pueda loguear*/
router.post('/forgotPassword',
    [ //middlewares
        //check('email', 'El correo de acceso es obligatorio').not().isEmpty(), //Validación sí envían null, "", undefined o no veían nada
        //InputsValidate
    ],
    postForgotPassword
);

module.exports = router;