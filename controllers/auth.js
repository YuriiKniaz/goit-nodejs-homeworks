const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = process.env;
const User = require("../models/users");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const jimp = require("jimp");
const path = require("path");

const avatarDirectory = path.join(__dirname, "../", "public", "avatars");

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
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

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

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Email or password is wrong" });
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
};
