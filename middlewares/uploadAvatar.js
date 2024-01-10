const path = require("path");
const multer = require("multer");

const temp = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: temp,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadAvatar = multer({
  storage: multerConfig,
});

module.exports = uploadAvatar;
