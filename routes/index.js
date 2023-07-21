var express = require("express");
var router = express.Router();

// Require controller modules.
const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");

/* GET home page. */
router.get("/", message_controller.message_list);
router.get("/login", user_controller.login_get);
router.post("/login", user_controller.login_post);
router.get("/signup", user_controller.signup_get);
router.post("/signup", user_controller.signup_post);
router.get("/join-club", user_controller.join_club_get);
router.post("/join-club", user_controller.join_club_post);
router.post("/logout", user_controller.logout);

router.get("/message", message_controller.message_get);
router.post("/message", message_controller.message_put);

router.post("/message/:id/delete", message_controller.message_delete);

module.exports = router;
