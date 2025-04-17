const express = require('express');
const app = express();
const log = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const { CONFIG } = require('./config/config');
const models = require("./models");
const router = require('./routes/v1');
const { cryptoDecrypt } = require('./services/cryptoService');
const { contextFunction, pubsub } = require('./middleware/contextFunction.js');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { upperDirectiveTransformer } = require('./custom-directives/upperCaseDirective.js');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { createServer } = require('http');
const typeDefs = require('./schema/schema.js');
const resolvers = require('./resolver/resolve.js');

const { graphqlUploadExpress } = require('graphql-upload');
const path = require('path');

// Enable file uploads (ensure this is before any middleware)
app.use(graphqlUploadExpress({ maxFileSize: 2 * 1024 * 1024, maxFiles: 1 }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/chatFiles", express.static(path.join(__dirname, "chatFiles")));

app.use(log('dev'));
app.use(express.json());
app.use(bodyParser.json())

models.connect();
models.sequelize.sync({ alter: false });

app.use(cors({
  origin: 'http://localhost:4200',   // ✅ Allow only Angular app to access the backend
  credentials: true,
  // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight']
}));


app.use(async function (req, res, next) {
  if (req.headers && req.headers.authorization) {
    req.headers.authorization = cryptoDecrypt(req.headers.authorization);
  }
  next();
});

const httpServer = createServer(app);

let schema = makeExecutableSchema({ typeDefs, resolvers });
schema = upperDirectiveTransformer(schema);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphqlserver',
});

app.use('/v1', router);

const serverCleanup = useServer({
  schema,
  context: async () => ({ pubsub }),
  onconnect: (ctx) => { console.log(' websocket connected! '); },
  onDisconnect: (ctx) => { console.log(' websocket connected! '); },
  keepAlive: 10000

}, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          }
        }
      }
    }
  ],
  context: ({ req, res }) => ({ req, res }),
  formatError: (error) => {
    return {
      message: error.message,
      extensions: {
        code: error.extensions?.code || "INTERNAL_SERVER_ERROR"
      }
    };
  },
});

async function startServer() {
  await server.start();
  app.use('/graphqlserver', expressMiddleware(server, { context: contextFunction }));
  httpServer.listen(CONFIG.PORT, () => {
    console.log("Apollo Server started successfully.");
    console.log("Apollo Server subscription started successfully.");
  })
}

startServer();

