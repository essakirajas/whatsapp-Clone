const { GraphQLError } = require('graphql');
const pe = require('parse-error')
/**
 * Author: Essakiraja
 * Created On: 06.03.2025
 * Modified On: 06.03.2025
 * Reviewed By: -
 * Description: Method which is used to return the error in the standard format .
 * @param req To define the HTTPS request.
 * @param res To define the HTTPS response.
 * @returns If error occurs then return error response.
 * Otherwise return the success response.
 */
const to = (promise) => {
  return promise
    .then((data) => {
      return [null, data];
    }).catch((err) => {
      return [pe(err)];
    });
};
module.exports.to = to;

/**
 * Metod which is designed to throw an error with a specified error message and optionally
 * log that message to the console if the log parameter is true.
 * @param {string} err_message To define the error message.
 * @param {boolean} log To define the log.
 */
const TE = function (err_message, log) { // TE stands for Throw Error
  if (log === true) {
    console.error(err_message);
  }
  throw new GraphQLError(err_message);
}
module.exports.TE = TE;

/**
 * Author: Essakiraja
 * Created On: 06.03.2025
 * Modified On: 06.03.2025
 * Reviewed By: -
 * Description: Method which is used to return the success response in the standard format.
 * @param req To define the HTTPS request.
 * @param res To define the HTTPS response.
 * @returns If error occurs then return error response.
 * Otherwise return the success response.
 */
const ReS = function (res, data, code) {
  const response = {
    success: true,
    data: data.data ? data.data : null,
    message: data.message ? data.message : null,
  }
  return res.json(response);
};
module.exports.ReS = ReS;
/**
 * Author: Essakiraja
 * Created On: 06.03.2025
 * Modified On: 06.03.2025
 * Reviewed By: -
 * Description: Method which is used to return the error response in the standard format.
 * @param req To define the HTTPS request.
 * @param res To define the HTTPS response.
 * @returns If error occurs then return error response.
 * Otherwise return the success response.
 */
const ReE = function (req, res, data, code) {
  const response = {
    success: false,
    data: data.error ? data.error : null,
    error: {
      code: code || "No error code",
      message: data.message ? data.message : null
    }
  };
  return res.json(response);
};
module.exports.ReE = ReE;