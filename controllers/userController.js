const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.login_get = asyncHandler(async (req, res, next) => {
  res.render("login_form");
});
exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});
exports.signup_get = asyncHandler(async (req, res, next) => {
  res.render("signup_form");
});
exports.signup_post = [
  body("username", "Username must be longer than 3 characters")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body("password", "Password must be longer than 3 characters")
    .trim()
    .isLength({ min: 4 })
    .escape(),
  body("passwordConfirm", "Passwords do not match")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        res.status(500).render("error");
      } else {
        const userExists = await User.findOne({
          username: req.body.username,
        }).exec();

        if (userExists) {
          errors.errors.push({ msg: "User already exists" });
        }

        if (!errors.isEmpty()) {
          res.render("signup_form", {
            username: req.body.username,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            errors: errors.array(),
          });
          return;
        } else {
          const user = new User({
            username: req.body.username,
            password: hashedPassword,
            membership: false,
            admin: false,
          });
          await user.save();
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }
            return res.redirect("/");
          });
        }
      }
    });
  }),
];
exports.join_club_get = asyncHandler(async (req, res, next) => {
  res.render("join_club_form");
});
exports.join_club_post = [
  body("code", "Wrong code").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("join_club_form", {
        code: req.body.code,
        errors: errors.array(),
      });
      return;
    }
    const codeCorrect = req.body.code === "q1w2e3r4";

    if (!codeCorrect) {
      res.render("join_club_form", {
        code: req.body.code,
        errors: [{ msg: "Wrong code" }],
      });
      return;
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        membership: true,
      });
      res.redirect("/");
    }
  }),
];
exports.logout = asyncHandler(async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
