const { Op } = require('sequelize');
const { requireAuth } = require('../services/requireAuth');

const User = require('../models').users;
const Message = require('../models').messages;

const NEW_POSt = 'NEW_POST';

const dashboard = {
  Subscription: {
    newMessage: {
      subscribe: (parent, args, { pubsub }) => {
        console.log("🔄 Subscription triggered for new messages!");
        return pubsub.asyncIterator(NEW_POSt);
      }
    }
  },

  Query: {
    friends: async function (_, args, { req, res, user }) {
      requireAuth(user);
      const users = await User.findAll({ where: { id: { [Op.ne]: args.userId } } });
      return users.map(user => ({ ...user.dataValues, requesterId: args.userId }));
    }
  },

  friendsDetails: {
    message: async (parent) => {
      return await Message.findOne({
        where: {
          [Op.or]: [
            { userId: parent.requesterId, receiverId: parent.id },
            { userId: parent.id, receiverId: parent.requesterId }
          ]
        },
        order: [['createdAt', 'DESC']]
      });
    }
  }
};

module.exports.dashboard = dashboard;
