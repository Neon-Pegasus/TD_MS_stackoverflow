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
  userName: { type: Sequelize.STRING, unique: true, allowNull: false },
  userId: { type: Sequelize.INTEGER },
  comment: { type: Sequelize.ARRAY(Sequelize.TEXT) },
});

// FOR FUTURE IF WANT TO ADD UPVOTES
// const Comments = stackDb.define('Comments', {
// comment: { type: Sequelize.ARRAY(Sequelize.TEXT) },
// upVotes: {type: Sequelize.INTEGER}
// });

stackDb.sync({ force: false });


const findAllIds = () => User.findAll({ attributes: ['userId'] }).then((data) => {
  const arrayOfIds = [];
  data.forEach((id) => {
    arrayOfIds.push(id.dataValues.userId);
  });
  return arrayOfIds;
})
  .catch((err) => {
    console.log(err);
  });


module.exports.User = User;
module.exports.findAllIds = findAllIds;
