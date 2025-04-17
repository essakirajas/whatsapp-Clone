const { CONFIG } = require('../config/config');

var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
/**
 * Author: Essakiraja
 * Created On: 05.03.2025
 * Modified On: 05.03.2025
 * Reviewed By: -
 * Description: Method which is used to verify the token by using the passport.
 * the token is used for time limit based link activation.
 * @param req To define the HTTPS request.
 * @param res To define the HTTPS response.
 * @returns If error occurs then return error response.
 * Otherwise return the success response.
 */
module.exports = (passport) => {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = CONFIG.SECRET_KEY;
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    if (jwt_payload) {
      return done(null, jwt_payload);
    } else {
      return done(null, false);
    }
  }));
}