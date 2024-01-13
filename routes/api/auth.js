const express = require("express");
const router = express.Router();
const validation = require("../../middlewares/contactValidation");
const {
  registerScheme,
  loginScheme,
  emailScheme,
} = require("../../scheme/users");
const authenticate = require("../../middlewares/authenthicate");
const {
  register,
  logIn,
  logOut,
  current,
  avatarUpdate,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth");
const uploadAvatar = require("../../middlewares/uploadAvatar");

router.post("/register", validation(registerScheme), register);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validation(emailScheme), resendVerifyEmail);

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
