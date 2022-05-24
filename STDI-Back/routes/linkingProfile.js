const {Router} = require('express');
const {validateJWT} = require('../middlewares/validate-jwt');
const router = Router();

const { postLinkingProfile } = require('../controllers/linkingProfile');

router.post('/linkingProfile', validateJWT, postLinkingProfile);

module.exports = router;