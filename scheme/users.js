const Joi = require("joi");

const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const registerScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passRegex).required(),
});

const loginScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passRegex).required(),
});

const emailScheme = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  registerScheme,
  loginScheme,
  emailScheme,
};
