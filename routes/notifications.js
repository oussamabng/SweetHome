const express = require("express");
const router = express.Router();
const { User, Alarm, Notification } = require("../models/user");
const config = require("config");

router.post("/getnotifications", async function(req, res) {
  console.log("notiiff bb");
  const notification = new Notification({
    type: req.body.type,
    content: req.body.content,
    time: req.body.time,
    userId: req.body.userId
  });
  await notification();
  res.status(200).send({ message: "notifications push success" });
});
module.exports = router;
