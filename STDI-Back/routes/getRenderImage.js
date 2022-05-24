const { Router } = require("express");

const router = Router();

const { getRenderImage } = require("../controllers/getRenderImage");

/*Para que el cliente pueda guardar su profile*/
router.get("/image/:userFolder/:subfolder/:key", getRenderImage);

module.exports = router;