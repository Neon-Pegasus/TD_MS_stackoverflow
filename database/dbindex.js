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

// FOR FUTURE IF WANT TO ADD UPVOTES
// const Comments = stackDb.define('Comments', {
// comment: { type: Sequelize.ARRAY(Sequelize.TEXT) },
// upVotes: {type: Sequelize.INTEGER}
// });

//stackDb.sync();


const updateAnswers = (answersObj) => {
  const { username, answers } = answersObj;
  return User.find({ where: { userName: username } })
    .then((data) => {
      if (data !== null) {
        return User.update({
          comment: answers,
        });
      }
      throw new Error('User does not exist');
    });
};
// updateAnswers({username: 'theRobinKim', answers: ['hello', 'bad', 'good'] })


const findAllIds = () => {
  return User.findAll({ attributes: ['userId'] }).then((data) => {
    const arrayOfIds = [];
    data.forEach((id) => {
      arrayOfIds.push(id.dataValues.userId);
    });
    return arrayOfIds;
  })
    .catch((err) => {
      console.log(err);
    });
};


module.exports.User = User;
module.exports.updateAnswers = updateAnswers;
module.exports.findAllIds = findAllIds;
// module.exports.Comments = Comments;
