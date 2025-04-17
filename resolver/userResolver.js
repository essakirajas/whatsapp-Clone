const User = require('../models').users;
const { generateToken } = require('../middleware/generateToken');
const { registerValidation, loginValidation } = require('../validator/validate');
const { AuthenticationError, UserInputError, ForbiddenError, ApolloError } = require('apollo-server-errors');
const dateScalar = require('../custom-scalar/dateScalar');
const { emailScalar } = require('../custom-scalar/emailScalar');
const { requireAuth } = require('../services/requireAuth');
const { to, TE } = require('../responsehandler');
const { authUser } = require('../services/authUser');
const randtoken = require('rand-token');

const { GraphQLUpload } = require('graphql-upload');
const upload = require('../middleware/upload'); // Import multer upload middleware
const fs = require('fs');
const { where } = require('sequelize');

const NEW_USER = 'NEW_USER';

const user = {
  Date: dateScalar,
  Email: emailScalar,
  Upload: GraphQLUpload,

  Subscription: {
    addUser: {
      subscribe: (parent, args, { pubsub }) => {
        console.log("Subscription triggered!");
        return pubsub.asyncIterator(NEW_USER);
      }
    }
  },

  Query: {
    login: async function (_, args) {
      const loginValidator = loginValidation(args);
      if (loginValidator) throw new UserInputError(loginValidator);
      let err, data, refreshToken;
      [err, data] = await to(authUser(args));
      if (err || !data.id) TE(err.message);
      const refreshtoken = randtoken.uid(128);
      [err, refreshToken] = await to(data.update({ refreshToken: refreshtoken }));
      if (err) TE(err.message);
      delete data.dataValues.pass;
      delete data.dataValues.otp;
      let encrypt_token;
      [err, encrypt_token] = await to(generateToken(data));
      if (err) TE(err.message);
      return { token: encrypt_token, refreshToken: refreshtoken, msg: "success" };
    },

    async user(_, __, { req, res, user }) {
      requireAuth(user);
      const users = user.data;
      return users;
    },

    async validToken(_, __, { req, res, user }) {
      requireAuth(user);
      if (!user) return { msg: "failure" };
      return { msg: "success" };
    },

    async getId(_, __, { req, res, user }) {
      requireAuth(user);
      const users = user.data;
      return users;
    },

    async validUser(_, args) {
      const [err, user] = await to(User.findOne({ where: { phoneNo: args.phoneNo } }));
      if (err) TE(err.message);
      if (user)
        return { msg: "User found" };
    },

    async users() {
      return await User.findAll();
    },
  },

  Mutation: {
    signUp: async function (_, { createuser, file }, { pubsub }) {
      let err, findUser, newUser;
      const registrationValidator = registerValidation(createuser);
      if (registrationValidator) throw new UserInputError(registrationValidator);
      [findUser, err] = await to(User.findOne({ where: { email: createuser.email } }));
      if (findUser) throw new UserInputError("User email is already registered");
      if (err) throw new Error("Error checking existing user");
      let imageUrl = null;
      if (file) {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        const path = `uploads/${Date.now()}-${filename}`;

        [_, err] = await to(new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(path);
          stream.pipe(writeStream);
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        }));
        if (err) throw new Error("Error uploading file");
        console.log(path);
        imageUrl = `http://localhost:5000/${path}`; // Store image URL
      }
      [newUser, err] = await to(User.create({ ...createuser, imgUrl: imageUrl }));
      if (err) throw new Error("Error creating user");
      pubsub.publish(NEW_USER, { addUser: newUser });
      return { msg: "Successfully user Created", imageUrl };
    }
  }
};

module.exports.user = user;
