const { User } = require("../models/user");
var express = require("express");
var bcryptNode = require("bcrypt-nodejs");
const router = express.Router();
var nodemailer = require("nodemailer");

router.get("/", function(req, res) {
  res.render("newpassword");
});

router.post("/send", function(req, res) {
  var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nodemailer.ouss@gmail.com",
      pass: "notrust2019"
    }
  });
  var mailOptions = {
    to: "sweetysmarthome@gmail.com",
    from: req.body.name + " ! " + req.body.email,
    subject: req.body.subject,
    text: req.body.message
  };
  smtpTransport.sendMail(mailOptions);

  res.send({ message: "mail sent successfully" });
});

router.post("/", function(req, res) {
  User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }).exec(function(err, user) {
    if (!err && user) {
      if (req.body.newPassword === req.body.verifyPassword) {
        const salt = bcryptNode.genSaltSync(10);
        user.password = bcryptNode.hashSync(req.body.newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err) {
          if (err) {
            return res.status(422).send({
              message: err
            });
          } else {
            var data = {
              to: user.email,
              from: "passwordReset@demo.com",
              subject: "Password Reset Confirmation",
              context: {
                name: user.username.split(" ")[0]
              }
            };
            var smtpTransport = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "nodemailer.ouss@gmail.com",
                pass: "notrust2019  "
              }
            });
            smtpTransport.sendMail(data, function(err) {
              if (!err) {
                return res.json({ message: "Password changed succesfully" });
              } else {
                return done(err);
              }
            });
          }
        });
      } else {
        return res.status(422).send({
          message: "Passwords do not match"
        });
      }
    } else {
      return res.status(400).send({
        message: "Password reset token is invalid or has expired."
      });
    }
  });
});
module.exports = router;
