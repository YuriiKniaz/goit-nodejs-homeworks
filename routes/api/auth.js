const express = require("express");
const router = express.Router();
const validation = require("../../middlewares/contactValidation");
const { registerScheme, loginScheme } = require("../../scheme/users");
const authenticate = require("../../middlewares/authenthicate");
const {
  register,
  logIn,
  logOut,
  current,
  avatarUpdate,
} = require("../../controllers/auth");
const uploadAvatar = require("../../middlewares/uploadAvatar");

router.post("/register", validation(registerScheme), register);

router.post("/login", validation(loginScheme), logIn);

router.post("/logout", authenticate, logOut);

router.get("/current", authenticate, current);

router.patch(
  "/avatars",
  authenticate,
  uploadAvatar.single("avatar"),
  avatarUpdate
);

module.exports = router;
