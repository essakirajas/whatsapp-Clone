const bcrypt = require('bcrypt');
const User = require('../models').users;
const { ERROR } = require('../constants/messages');
const { to, TE } = require('../responsehandler');
/**
 * Author: Essakiraja
 * Created On: 06.03.2025
 * Modified On: 06.03.2025
 * Reviewed By: -
 * Description: Method which is used to authorize the user whether the user is found or not and compare the password is matched.
 * And also it is used to check whwther the mail verification is verified or not.
 * If it is done ,it returns the user.
 * @param req To define the HTTPS request.
 * @param res To define the HTTPS response.
 * @returns If error occurs then return error response.
 * Otherwise return the success response.
 */
const authUser = async (data) => {
  let err, user;
  [err, user] = await to(User.findOne({
    where: { phoneNo: data.phoneNo }
  }));
  if (err) return TE(err.message);
  if (!user || data.otp == null) return TE("No User Found in the Email");
  if (data.otp == user.otp) {
    return user;
  }
  else {
    return TE("Invalid Otp");
  }

};
module.exports = { authUser };
