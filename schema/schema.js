const { mergeTypeDefs } = require('@graphql-tools/merge');

const user = require('./userSchema');
const message = require('./messageSchema');
const dashboard = require('./dashboardSchema');

// ✅ Merge into a single schema
const typeDefs = mergeTypeDefs([user, message, dashboard]);

module.exports = typeDefs;
