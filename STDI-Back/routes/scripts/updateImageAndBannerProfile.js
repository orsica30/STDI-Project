const { Router } = require("express");

const router = Router();

const multer  = require('multer');
const upload = multer({dest: './tmp/uploads'});

const { updateImageAndBannerProfile } = require("../../controllers/scripts/updateImageAndBannerProfile");

/*Para que el cliente pueda guardar su profile*/
router.post("/updateImageAndBannerProfile",  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
    ]), 
updateImageAndBannerProfile);

module.exports = router;