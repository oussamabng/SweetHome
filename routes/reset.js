const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const { User } = require("../models/user");
var express = require("express");
var bcryptNode = require("bcrypt-nodejs");
const router = express.Router();

var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
var bcrypt = require("bcrypt-nodejs");
var async = require("async");
var crypto = require("crypto");
var flash = require("req-flash");

router.get("/", function(req, res) {
  res.render("newpassword");
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
