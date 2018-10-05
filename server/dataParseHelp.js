//THIS FILE SEPERATES THE FUNCTIONS FOR THE SERVER FROM THE SERVER 

// const getAllAnswerIds = (list, length) => {
//   for (var i = 0; i < length; i++) {
//     answersList += list.data.items[i].answer_id +';'
// };

// const parser = (val) => {
//   parse = JSON.parse(JSON.stringify(val));
//   parse = parse.replace(/<\/?p>/gim, '');
//   parse = parse.replace(/<\/?ol>/gim, '');
//   parse = parse.replace(/<\/?strong>/gim, '');
//   parse = parse.replace(/<\/?em>/gim, '');
//   parse = parse.replace(/<\/?ul>/gim, '');  
//   parse = parse.replace(/<\/?code>/gim, '');
//   parse = parse.replace(/<\/?div>/gim, '');
//   parse = parse.replace(/<\/?li>/gim, '');
//   parse = parse.replace(/<\/?pre>/gim, '');
//   parse = parse.replace(/<a +.+">/gim, '');
//   parse = parse.replace(/<\/a>/gim, '');
//   parse = parse.replace(/<\/?br>/gim, '\n');
//   parse = parse.replace(/<blockquote>+\n+\s+/gim, '"')
//   parse = parse.replace(/(\s)+<\/blockquote>/gim, '"\n')
//   return parse
// }

// module.exports.getAllAnswerIds = getAllAnswerIds;
// module.exports.parser = parser;
