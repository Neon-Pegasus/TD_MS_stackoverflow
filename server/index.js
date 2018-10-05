const express = require('express');
const axios = require('axios');
const bodyparser = require('body-parser');
const db = require('../database/dbindex.js')


const parser = (val) => {
  parse = JSON.parse(JSON.stringify(val));
  parse = parse.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gim, '');
  parse = parse.replace(/\n+/gim, '')
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
  parse = parse.replace(/\s\s/gim, '')
  parse = parse.replace(/<blockquote>+\n+\s+/gim, '"')
  parse = parse.replace(/(\s)+<\/blockquote>/gim, '"\n')
  return parse
}






const stackServer = express();
let port = 3000;

stackServer.use(bodyparser.json());

stackServer.listen(port, () => {
  console.log(`listening on ${port}`)
});

stackServer.get('/search/userId', (req, res) => {
  // TODO: re-factor to create name from request object
  var userName = 'therobinkim';
  var userId = 0;
  var answersList = '';
  var parsedArr = [];

  var api = `https://api.stackexchange.com/2.2/users?inname=${userName}&site=stackoverflow`
  axios.get(api)
  .then((data) => {
    userId = data.data.items[0].user_id;
    return userId;
  })
  .then((userId) => {
      return axios.get(`https://api.stackexchange.com/2.2/users/${userId}/answers?order=desc&sort=activity&site=stackoverflow`)
  })
  .then((answers) => {
      var answerListLength = answers.data.items.length;
      for (var i = 0; i < answerListLength; i++) {
        answersList += answers.data.items[i].answer_id +';'
      }
  })
  .then(() => {
    var sliceTrailSemi = answersList.slice(0, answersList.length-1);
    return axios.get(`https://api.stackexchange.com/2.2/answers/${sliceTrailSemi}?order=desc&sort=activity&site=stackoverflow&filter=-7QjUZkk7Ae`)
  })
  .then((answerObj) => {
    for (let i = 0; i < answerObj.data.items.length; i++) {
      var parsedAns = '' ;
      parsedAns += parser(answerObj.data.items[i].body);
      parsedArr.push(parsedAns);
    }
  })
  .then(() => {
    db.User.create({
      userName: userName,
      userId: userId,
      comment: parsedArr
    })
    res.send("RETRIEVED ANSWER DATA FOR USER AND STORED IN DATABASE")
  })
  .catch((err) => {
    console.log(err, 'failed to get')
  })
});
