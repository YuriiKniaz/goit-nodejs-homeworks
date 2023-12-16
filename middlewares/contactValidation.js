const HttpError = require('../helpers/HttpError');

const contactValidation = (schema) => {
    const validation = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(404, error.message));
        }
        next()
    }
    return validation;
}

module.exports = contactValidation;