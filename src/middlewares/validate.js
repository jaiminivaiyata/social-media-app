const Joi = require('joi');
const httpStatus = require('http-status');

const commonFunctions = require('../general-components/common-functions');
const ApiError = require('../utils/ApiError');


const validate = (schema) => (req, res, next) => {
  const validSchema = commonFunctions.pick(schema, ['params', 'query', 'body', "fields", "files"]);
  const object = commonFunctions.pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
