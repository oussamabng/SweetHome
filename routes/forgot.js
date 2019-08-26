const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const { User } = require("../models/user");
var express = require("express");
const path = require("path");

const router = express.Router();

var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
var bcrypt = require("bcrypt-nodejs");
var async = require("async");
var crypto = require("crypto");

router.post("/", function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            return res.redirect("/forgot");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "nodemailer.ouss@gmail.com",
            pass: "notrust2019"
          }
        });
        var mailOptions = {
          to: user.email,
          from: "passwordReset@demo.com",
          subject: "Reseting password ",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://localhost:3000/reset/?token=" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err, "done");
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.send({ message: "work " });
    }
  );
});

module.exports = router;
