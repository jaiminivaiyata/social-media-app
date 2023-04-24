const httpStatus = require('http-status');
const { authService, userService, tokenService } = require('../services');
const {sendCommonResponse} = require("../general-components/response");


const register = async (request, response) => {
  const user = await userService.createUser(request.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const responseObject = {
    code: httpStatus.CREATED,
    data: { user, tokens },
    message: "User has been created successfully!"
  }
  sendCommonResponse(response, httpStatus.CREATED, responseObject)
};

const login = async (request, response) => {
  const { email, password } = request.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const responseObject = {
    code: httpStatus.OK,
    data: { user, tokens },
    message: "User logged in successfully!"
  }
  sendCommonResponse(response, httpStatus.OK, responseObject)

};

const logout = async (request, response) => {
  await authService.logout(request.body.refreshToken);
  const responseObject = {
    code: httpStatus.NO_CONTENT,
    message: "User logged out successfully!"
  }
  sendCommonResponse(response, httpStatus.NO_CONTENT, responseObject)
};

const refreshTokens = async (request, response) => {
  const tokens = await authService.refreshAuth(request.body.refreshToken);

  const responseObject = {
    code: httpStatus.OK,
    data: { ...tokens },
    message: ""
  }
  sendCommonResponse(response, httpStatus.OK, responseObject)
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
};
