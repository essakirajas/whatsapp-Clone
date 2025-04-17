const { mergeResolvers } = require('@graphql-tools/merge');
const { user } = require('./userResolver');
const { message } = require('./messageResolver');
const { dashboard } = require('./dashboardResolver');


const resolvers = mergeResolvers([user, message, dashboard]);

module.exports = resolvers;
