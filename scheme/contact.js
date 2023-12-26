const Joi = require('joi');

const conScheme = Joi.object({
  name: Joi.string().min(3).max(24).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().min(10).required(),
  favorite: Joi.boolean()
});

const favoriteScheme = Joi.object({
  favorite: Joi.boolean().required(),
})

module.exports = {conScheme, favoriteScheme};