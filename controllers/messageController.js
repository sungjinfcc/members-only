const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Message = require("../models/message");

exports.message_list = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({});
  res.render("index", { messages: allMessages });
});
exports.message_get = asyncHandler(async (req, res, next) => {
  res.render("message_form");
});
exports.message_put = [
  body("message", "Message must be longer than 3 characters")
    .isLength({ min: 4 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("message_form", {
        message: req.body.message,
        errors: errors.array(),
      });
      return;
    } else {
      const message = new Message({
        username: req.user.username,
        message: req.body.message,
        timestamp: new Date(),
      });
      await message.save();
      res.redirect("/");
    }
  }),
];
exports.message_delete = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();
  if (message !== null) {
    await Message.findByIdAndRemove(req.params.id);
  }

  res.redirect("/");
});
