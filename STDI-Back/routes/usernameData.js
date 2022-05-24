const { Router } = require("express");
const router = Router();


const {
  postUsernameData,
} = require("../controllers/usernameData.js");

/*Para que el cliente pueda guardar su profile*/
router.post(
  "/usernameData",
  postUsernameData
);

module.exports = router;