const { AuthenticationError } = require('apollo-server-errors');

const requireAuth = (user) => {
  if (!user)
    throw new AuthenticationError("Invalid token");
}

module.exports = { requireAuth };