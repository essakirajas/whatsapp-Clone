const CryptoJs = require('crypto-js');
const { CONFIG } = require('../config/config');
const { to, TE } = require('../responsehandler');
const { GraphQLError } = require('graphql');

/**
 * Author: Essakiraja
 * Created On: 06.03.2025
 * Modified On: 06.03.2025
 * Reviewed By: -
 * Description: Method which is used to encrypt the token for additional security reason.
 * @param req To define the HTTPS request.
 * @param res To define the HTTPS response.
 * @returns If error occurs then return error response.
 * Otherwise return the success response.
 */
const cryptoEncrypt = (plaintext) => {
  const encrypt = CryptoJs.AES.encrypt(plaintext.toString(), CONFIG.SECRET_KEY).toString();
  return encrypt;
}
module.exports.cryptoEncrypt = cryptoEncrypt;
/**
 * Author: Essakiraja
 * Created On: 06.03.2025
 * Modified On: 06.03.2025
 * Reviewed By: -
 * Description: Method which is used to decrypt the token for jwt verification in Utf8 format.
 * @param req To define the HTTPS request.
 * @param res To define the HTTPS response.
 * @returns If error occurs then return error response.
 * Otherwise return the success response.
 */
const cryptoDecrypt = (plaintext) => {
  try {

    const bytes = CryptoJs.AES.decrypt(plaintext, CONFIG.SECRET_KEY);
    const crypto_decrypt = bytes.toString(CryptoJs.enc.Utf8);
    return crypto_decrypt;
  }
  catch (err) {
    if (err)
      return null;
  }
}
module.exports.cryptoDecrypt = cryptoDecrypt;