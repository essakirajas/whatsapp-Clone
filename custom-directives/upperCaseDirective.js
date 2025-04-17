const { mapSchema, getDirective, MapperKind } = require("@graphql-tools/utils");
const { defaultFieldResolver, GraphQLString } = require("graphql");

function upperDirectiveTransformer(schema, directiveName = "upper") {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (upperDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (...args) {
          const result = await resolve.apply(this, args);
          return typeof result === "string" ? result.toUpperCase() : result;
        };
        fieldConfig.type = GraphQLString; // Ensure the type is String
      }
      return fieldConfig;
    },
  });
};

module.exports = { upperDirectiveTransformer };