const { Router } = require("express");

const router = Router();

const {
  postTestEmail,
} = require("../controllers/testEmail");

router.post(
  "/testEmail",
  postTestEmail
);

module.exports = router;