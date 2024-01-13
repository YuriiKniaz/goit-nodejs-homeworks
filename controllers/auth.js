const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = process.env;
const User = require("../models/users");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const sendEmail = require("../helpers/sendgridEmail");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const jimp = require("jimp");
const path = require("path");
const { nanoid } = require("nanoid");
const avatarDirectory = path.join(__dirname, "../", "public", "avatars");
require("dotenv").config();
const { BASE_URL } = process.env;

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      res.status(409).json({ message: "Email in use" });
      return;
    }
    const avatarURL = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
    });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    console.log(error);
  }
};

const resendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404, { message: "Email not found" });
      return;
    }
    if (!user.verify) {
      res.status(400, { message: "Email already verified" });
      return;
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
      message: "Verification send again",
    });
  } catch (error) {
    console.log(error);
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Email or password is wrong" });
      return;
    }

    if (!user.verify) {
      res.status(401).json({ message: "Email not verified" });
      return;
    }

    const passCompare = await bcrypt.compare(password, user.password);

    if (!passCompare) {
      res.status(401).json({ message: "Email or password is wrong" });
      return;
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const logOut = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
  } catch (error) {
    console.log(error);
  }
};

const current = async (req, res) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({ email, subscription });
  } catch (error) {
    console.log(error);
  }
};

const avatarUpdate = async (req, res) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;

    const fileName = `${_id}_${originalname}`;
    const uploading = path.join(avatarDirectory, fileName);

    (await jimp.read(tempUpload)).resize(250, 250).write(tempUpload);
    await fs.rename(tempUpload, uploading);
    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register: ctrlWrapper(register),
  logIn: ctrlWrapper(logIn),
  logOut: ctrlWrapper(logOut),
  current: ctrlWrapper(current),
  avatarUpdate: ctrlWrapper(avatarUpdate),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
