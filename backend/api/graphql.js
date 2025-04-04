import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import typeDefs from '../graphql/typeDefs.mjs';
import resolvers from '../graphql/resolvers.mjs';
import { connectToDB } from '../lib/db.js';

// Connect to database
connectToDB();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Setup Apollo Server
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });
  
  return app;
};

// Initialize server
let apolloServer;
let serverPromise;

if (!apolloServer) {
  serverPromise = startServer();
}

export default async function handler(req, res) {
  const app = await serverPromise;
  return app(req, res);
} 