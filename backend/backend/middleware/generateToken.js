const jwt = require('jsonwebtoken');
const { cryptoEncrypt } = require('../services/cryptoService');
const { CONFIG } = require('../config/config');

/**
 * Author: Essakiraja
 * Created On: 05.03.2025
 * Modified On: 05.03.2025
 * Reviewed By: -
 * Description: Method which is used to generate the jwt token and pass it to encrytion.
 * the token is used for time limit based link activation.
 * @param req To define the HTTPS request.
 * @param res To define the HTTPS response.
 * @returns If error occurs then return error response.
 * Otherwise return the success response.
 */
const generateToken = async (data) => {
  const jwt_token = "Bearer " + jwt.sign({ data }, CONFIG.SECRET_KEY, { expiresIn: CONFIG.EXPIRY_IN });
  const encryptedToken = cryptoEncrypt(jwt_token);
  return encryptedToken;
}

module.exports = { generateToken };