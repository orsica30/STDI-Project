const { Router } = require("express");

const router = Router();

const {
  postSendNotification,
} = require("../controllers/sendNotification");

router.post(
  "/sendNotification",
  postSendNotification
);

module.exports = router;