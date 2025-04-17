const { GraphQLScalarType, Kind } = require('graphql');

const emailScalar = new GraphQLScalarType({
  name: 'Email',
  description: "Email formatting scalar",

  serialize(value) {
    return value.toLowerCase();
  },
  parseValue(value) {
    return value.toLowerCase();
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value.toLowerCase();
    }
    throw new Error('Email must be a string');
  }
});

module.exports.emailScalar = emailScalar;
