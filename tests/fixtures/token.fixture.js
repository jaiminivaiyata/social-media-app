const moment = require('moment');
const config = require('../../src/general-resources/config');
const { tokenTypes } = require('../../src/general-components/constants');
const tokenService = require('../../src/services/token.service');
const { userOne, admin, userTwo } = require('./user.fixture');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);
const userTwoAccessToken = tokenService.generateToken(userTwo._id, accessTokenExpires, tokenTypes.ACCESS);
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS);

module.exports = {
  userOneAccessToken,
  userTwoAccessToken,
  adminAccessToken,
};
