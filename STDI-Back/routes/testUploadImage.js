const { Router } = require("express");
//const {check} = require('express-validator');
//const {InputsValidate} = require('../middlewares/field-validator');

const multer  = require('multer');
const upload = multer({dest: './tmp/uploads'});

const router = Router();

const { postTestUploadImage } = require("../controllers/testUploadImage");

/*Para que el cliente pueda guardar su profile*/
router.post("/testUploadImage", upload.single('image'), postTestUploadImage);

module.exports = router;