const axios = require('axios');
const csv = require('csv');
const _ = require('ramda');

const csvParse = (csvData, options) =>
  new Promise((resolve, reject) =>
    csv.parse(csvData, options, (err, sheet) => (err)
      ? reject(err)
      : resolve(sheet)));

const transform = (sheet, data) => {
  data.questionCount = 0;
  data.stateQuestions = {};
  data.tips = [];
  data.thanks = [];
  _.map((row) => {
    if (row.type === 'question') {
      data.questionCount = data.questionCount + 1;
      const questionStates = row.states && row.states.split(',') || [];
      questionStates.forEach((state) => {
        data.stateQuestions[state] = data.stateQuestions[state] || [];
        data.stateQuestions[state].push(row.text);
      })
    }
    if (row.type === 'tip') {
      data.tips.push(row.text);
    }
    if (row.type === 'thanks') {
      data.thanks.push(row.text);
    }
  }, sheet);
}

const spreadsheetRequest = (url, data) => {
  const csvOptions = { columns: true };
  return axios.get(url, { timeout: 10000 })
    .then(({ data: csvData }) => csvParse(csvData, csvOptions))
    .then((sheet) => transform(sheet, data));
};

module.exports = (data) => {
  const url = `https://docs.google.com/spreadsheets/d/1bGDAomdjG_-_rlWa3Dfn1TcFFEmMvVflsuROn29IcoY/pub?gid=0&single=true&output=csv`;
  return spreadsheetRequest(url, data);
};