const { isValidObjectId } = require("mongoose");

const  HttpError  = require("../helpers/HttpError");

const isValid = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(HttpError(404, "not found"));
  }
  next();
};

module.exports = isValid;