const { Org } = require('../dataBase/dbindex.js');

module.exports = {
  Query: {
    allOrgs: () => Org.findAll({ attributes: 'orgName' }),
  },
  // Mutation: {
  //   addTweets: (root, args) => {
  //     const Tweet = { tweets: [tweet]};
  //   },
  // },
};