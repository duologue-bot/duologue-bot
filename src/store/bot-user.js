const { INITIALSTATE } = require('../state/state-machine');

// Use ultra-web-scale database
const userDatabase = {};

const defaultBotUserFactory = ({ psid }) => {
  const now = new Date();
  return {
    facebookUser: {
      psid,
    },
    details: {
      createdAt: now,
      lastUpdatedAt: now,
      state: INITIALSTATE,
      history: [],
      questions: {},
    },
  };
};

module.exports = () => {

  const store = {};

  store.getDatabase = () => {
    return userDatabase;
  }

  store.getByFacebookPsid = (psid) => {
    if (!userDatabase[psid]) {
      userDatabase[psid] = defaultBotUserFactory({ psid });
    }
    return Promise.resolve(userDatabase[psid]);
  };

  store.addTextHistory = (psid, text) => {
    userDatabase[psid].details.history.push({ type: 'text', text, ts: Date.now() });
    return Promise.resolve();
  }

  store.updateCurrentState = (psid, state, text) => {
    userDatabase[psid].details.state = state;
    userDatabase[psid].details.history.push({ type: 'new-state', state, ts: Date.now() });
    return Promise.resolve();
  };

  store.setQuestionIndex = (psid, question, index) => {
    userDatabase[psid].details.questions[question] = index;
    console.log('Set',question,index);
    return Promise.resolve();
  };

  store.getQuestionIndex = (psid, question) => {
    console.log('Get',question,userDatabase[psid].details.questions[question]);
    return Promise.resolve(userDatabase[psid].details.questions[question]);
  };

  return Object.freeze(store);
};
