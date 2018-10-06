const { ApolloServer } = require('apollo-server');
const typeDefs = require('../QLschema/schema.js');
const resolvers = require('../resolvers/resolvers.js');

const stackServer = new ApolloServer({
  typeDefs,
  resolvers,
});

stackServer.listen()
  .then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
