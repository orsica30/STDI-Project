
const { response } = require('express');
const { validationResult } = require('express-validator');

const InputsValidate = (req, res = response, next) => {

    const errors = validationResult( req ); //Manejo de errores //console.log(errors);
    if( !errors.isEmpty() ){
        return res.status(400).json({ ok: false, errors: errors.mapped() });
    }

    next();
}

module.exports = {
    InputsValidate
};