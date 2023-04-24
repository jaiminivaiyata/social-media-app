const { default: mongoose } = require('mongoose');
const httpStatus = require("http-status");
const config = require("../general-resources/config");
const {sendCommonResponse} = require("../general-components/response");
const ApiError = require('../utils/ApiError');


const errorConverter = (err, req, res, next) => {

    let error = err;

    if (!(error instanceof ApiError)) {
      const statusCode =
        error.statusCode ? error.statusCode : (error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR);
    
      const message = error.message ? error.message : httpStatus[`${statusCode}`];

      error = new ApiError(statusCode, message, false, err.stack);

    }
    next(error);
  };

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let {statusCode, message} = err;
    if (config.env === "production") {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = message;

    const responseObject = {
        code: statusCode,
        message: message
    };

    sendCommonResponse(res, statusCode, responseObject);
};

const pathNotFoundHandler = (req, res, next) => {
    const responseObject = {
        code: httpStatus.NOT_FOUND,
        message: httpStatus[httpStatus.NOT_FOUND]
    };

    sendCommonResponse(res, httpStatus.NOT_FOUND, responseObject);
};

module.exports = {
    errorHandler,
    pathNotFoundHandler,
    errorConverter
};
