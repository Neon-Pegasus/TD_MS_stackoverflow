const Sequelize = require('sequelize');
require('dotenv').config();

const stackDb = new Sequelize(`${process.env.STACK_DB}`);

stackDb
  .authenticate()
  .then(() => {
    console.log('connected to Stack DB');
  })
  .catch((err) => {
    console.error('unable to connect to Stack db', err);
  });

const User = stackDb.define('User', {
  userName: { type: Sequelize.STRING },
  userId: { type: Sequelize.INTEGER },
  comment: { type: Sequelize.ARRAY(Sequelize.TEXT) },
});

// const Comments = stackDb.define('Comments', {
// comment: { type: Sequelize.ARRAY(Sequelize.TEXT) },
// upVotes: {type: Sequelize.INTEGER}
// });

stackDb.sync()
  .then(() => {
    User.create({})
      .then(() => {});
  });

module.exports.User = User;
// module.exports.Comments = Comments;
