const Message = require('../models').messages;
const User = require('../models').users;
const { UserInputError } = require('apollo-server-errors');
const dateScalar = require('../custom-scalar/dateScalar');
const { to } = require('../responsehandler');
const { Op, where } = require('sequelize');
const { withFilter } = require('graphql-subscriptions');
const { pubsub } = require('../middleware/contextFunction')

const { GraphQLUpload } = require('graphql-upload');
const upload = require('../middleware/upload'); // Import multer upload middleware
const fs = require('fs');

const NEW_POST = 'NEW_POST';

const message = {
  Date: dateScalar,
  Upload: GraphQLUpload,

  Subscription: {
    Messages: {
      subscribe: withFilter(
        (parent, args, { pubsub }) => {
          console.log("Subscription triggered!");
          return pubsub.asyncIterator(NEW_POST);
        },
        (payload, variables) => {
          // Ensure only relevant users receive messages
          return (
            (payload.Messages.userId === variables.userId && payload.Messages.receiverId === variables.receiverId) ||
            (payload.Messages.userId === variables.receiverId && payload.Messages.receiverId === variables.userId)
          );
        }
      ),
    },
  },
  Query: {
    messages: async function name(_, args) {
      const data = await Message.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { userId: args.sender },
                { receiverId: args.receiver }
              ]
            },
            {
              [Op.and]: [
                { userId: args.receiver },
                { receiverId: args.sender }
              ]
            }
          ]
        },
        order: [['createdAt', 'ASC']]
      });
      return data;
    },

    userDetails: async function (_, args) {
      return await User.findOne({ where: { id: args.receiverId } });
    }
  },

  Mutation: {
    postMessage: async function (_, { newMsg, file }, { req, pubsub }) {
      // console.log(newMsg, file);
      let fileUrl = null;
      if (file) {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        const path = `chatFiles/${Date.now()}-${filename}`;

        [_, err] = await to(new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(path);
          stream.pipe(writeStream);
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        }));
        if (err) throw new Error("Error uploading file");
        console.log(path);
        fileUrl = `http://localhost:5000/${path}`; // Store image URL
      }
      [err, newMsg] = await to(Message.create({ ...newMsg, fileUrl: fileUrl }));
      if (err) throw new Error("Error creating user");
      pubsub.publish(NEW_POST, { Messages: newMsg })
      return newMsg;
    }
  }
}

module.exports.message = message;