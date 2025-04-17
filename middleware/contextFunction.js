const passport = require('passport');
require('./passport')(passport);
const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis');

const redisOption = { host: '127.0.0.1', port: 6379 };
const publisher = new Redis(redisOption);
const subscriber = new Redis(redisOption);
const pubsub = new RedisPubSub({ publisher, subscriber });

const contextFunction = async ({ req }) => {
  return new Promise((resolve) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      const context = {
        pubsub,
        user: err || !user ? null : user
      };
      resolve(context);
    })(req);
  });
}

module.exports = { contextFunction, pubsub };