const Joi = require('@hapi/joi');

const registerValidation = (args) => {
  const registerSchema = Joi.object({
    name: Joi.string().min(5).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(5).required(),
    phoneNo: Joi.number().required()
  });
  const { error } = registerSchema.validate(args);
  if (error) return error.details[0].message;
};
module.exports.registerValidation = registerValidation;

const loginValidation = (args) => {
  const loginSchema = Joi.object({
    phoneNo: Joi.number().required(),
    otp: Joi.string().min(6).max(6).required(),
  });
  const { error } = loginSchema.validate(args);
  if (error) return error.details[0].message;
};
module.exports.loginValidation = loginValidation;