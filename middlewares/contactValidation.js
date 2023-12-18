const HttpError = require('../helpers/HttpError');

const contactValidation = (schema) => {
    const validator = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return validator;
}

module.exports = contactValidation;