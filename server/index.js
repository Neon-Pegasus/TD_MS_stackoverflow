const express = require('express');
const axios = require('axios');
const bodyparser = require('body-parser');
const db = require('../database/dbindex.js');


const parser = (val) => {
  let parse;
  parse = JSON.parse(JSON.stringify(val));
  parse = parse.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gim, '');
  parse = parse.replace(/\n+/gim, '');
  parse = parse.replace(/<code>(.*?)<\/code>/gim, '');
  parse = parse.replace(/<\/?p>/gim, ' ');
  parse = parse.replace(/<\/?ol>/gim, ' ');
  parse = parse.replace(/<\/?strong>/gim, ' ');
  parse = parse.replace(/<\/?em>/gim, ' ');
  parse = parse.replace(/<\/?ul>/gim, ' ');
  parse = parse.replace(/<\/?div>/gim, ' ');
  parse = parse.replace(/<\/?li>/gim, ' ');
  parse = parse.replace(/<\/?pre>/gim, ' ');
  parse = parse.replace(/<a +.+">/gim, ' ');
  parse = parse.replace(/<\/a>/gim, '');
  parse = parse.replace(/<\/?br>/gim, '"\n');
  parse = parse.replace(/\s\s/gim, '');
  parse = parse.replace(/<blockquote>+\n+\s+/gim, '"');
  parse = parse.replace(/(\s)+<\/blockquote>/gim, '"\n');
  return parse;
};

const stackServer = express();
const port = process.env.PORT || 4000;

stackServer.use(bodyparser.json());

stackServer.listen(port, () => {
  console.log(`listening on ${port}`);
});

stackServer.get('/api/user/so', (req, res) => {
  const userName = req.query.username || 'therobinkim';
  let userId = 0;
  const parsedArr = [];

  const api = `https://api.stackexchange.com/2.2/users?inname=${userName}&site=stackoverflow`;
  axios.get(api)
    .then((data) => {
      userId = data.data.items[0].user_id;
      return axios.get(`https://api.stackexchange.com/2.2/users/${userId}/answers?order=desc&sort=activity&site=stackoverflow`);
    })
    .then((answers) => {
      let answersList = '';
      const answerListLength = answers.data.items.length;
      for (let i = 0; i < answerListLength; i += 1) {
        answersList += `${answers.data.items[i].answer_id};`;
      }
      const sliceTrailSemi = answersList.slice(0, answersList.length - 1);
      return axios.get(`https://api.stackexchange.com/2.2/answers/${sliceTrailSemi}?order=desc&sort=activity&site=stackoverflow&filter=-7QjUZkk7Ae`);
    })
    .then((answerObj) => {
      for (let i = 0; i < answerObj.data.items.length; i += 1) {
        let parsedAns = '';
        parsedAns += parser(answerObj.data.items[i].body);
        parsedArr.push(parsedAns);
      }
      return db.User.create({
        userName,
        userId,
        comment: parsedArr,
      });
    })
    .then(() => {
      res.send({ username: userName, answers: parsedArr });
    })
    .catch((err) => {
      console.log(err, 'failed to get');
    });
});


const getAnswersAndUpdateDb = (userId) => {
  const parsedArr = [];

  return axios.get(`https://api.stackexchange.com/2.2/users/${userId}/answers?order=desc&sort=activity&site=stackoverflow`)
    .then((answers) => {
      let answersList = '';
      const answerListLength = answers.data.items.length;
      for (let i = 0; i < answerListLength; i += 1) {
        answersList += `${answers.data.items[i].answer_id};`;
      }
      const sliceTrailSemi = answersList.slice(0, answersList.length - 1);
      return axios.get(`https://api.stackexchange.com/2.2/answers/${sliceTrailSemi}?order=desc&sort=activity&site=stackoverflow&filter=-7QjUZkk7Ae`);
    })
    .then((answerObj) => {
      for (let i = 0; i < answerObj.data.items.length; i += 1) {
        let parsedAns = '';
        parsedAns += parser(answerObj.data.items[i].body);
        parsedArr.push(parsedAns);
      }
    })
    .then(() => {
      return db.updateAnswers({ userNum: userId, answers: parsedArr });
    })
    .catch((err) => {
      console.log(err, 'failed to get');
    });
};

// SPLIT ARRAYS OF USER IDS IF THE LENGTH IS LONGER THAN 99
const updateEachUser = () => {
  const promiseArr = [];
  db.findAllIds()
    // .then((array) => {
    //   return array;
    // })
    .then((array) => {
      array.forEach((id) => {
        promiseArr.push(getAnswersAndUpdateDb(id));
      });
      return Promise.all(promiseArr);
    });
};
updateEachUser()


const scheduledUpdate = () => {
  // set an interval to run updates on all users in data base
  //     divide the 
};