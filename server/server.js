


  const express = require('express');
const { ApolloServer } = require('apollo-server-express')
const { authMiddleware } = require('./utils/auth');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()
const db = require('./config/connection');
//import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
//const routes = require('./routes');
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate our Apollo server with the express application as middleware
  server.applyMiddleware({ app });
  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  //app.use(routes);
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on ${PORT}!`);
      //log where we can go to test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};
//call the async function to start the server
startApolloServer(typeDefs, resolvers);