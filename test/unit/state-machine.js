const expect = require('expect.js');
const {stateMachine: botStateMachine} = require('../../src/state/state-machine');
const botUserStoreCtr = require('../../src/store/bot-user');

describe('Bot State Machine', () => {
  const userPsid = 123456;
  const store = {}
  const botUserStore = botUserStoreCtr();
  const fbClient = {setRead: () => {}, sendTextMessage: () => {}};
  const data = require('../data.json');
  const getInstanceFsm = (initialState) => {
    const botFsm = botStateMachine({ botUserStore, fbClient, data });
    return botFsm.create(initialState, userPsid);
  }

  it('Should be initialized with no state and returned the fsm on a prop with the initial state', async () => {
    await botUserStore.getByFacebookPsid(userPsid);
    return new Promise((resolve, reject) => {
      const initialState = 'index';
      const instanceFsm = getInstanceFsm(initialState);
      expect(instanceFsm.fsm.state).to.equal(initialState);
      resolve({});
    });
  });

  describe('Index state', () => {
    it('Responds with an introduction and quick replies if nothing matches what we are looking for', async () => {
      return new Promise((resolve, reject) => {
        const initialState = 'none';
        const instanceFsm = getInstanceFsm(initialState);
        fbClient.sendTextMessage = async (psid, text) => {
          console.log(text);
          expect(instanceFsm.fsm.transition.to).to.equal('sayIndex');
        };
        instanceFsm.fsm.on('@index:end', (event, fsm) => {
          resolve({});
        });
        expect(instanceFsm.fsm.state).to.equal(initialState);
        instanceFsm.parse('index');
      });
    });

    it('Responds with help if we ask for it', async () => {
      return new Promise((resolve, reject) => {
        const initialState = 'none';
        const instanceFsm = getInstanceFsm(initialState);
        fbClient.sendTextMessage = (psid, text, quickReplies) => {
          console.log(text);
          expect(instanceFsm.fsm.transition.to).to.equal('sayHelp');
        };
        expect(instanceFsm.fsm.state).to.equal(initialState);
        instanceFsm.fsm.on('@help:end', (event, fsm) => {
          resolve({});
        });
        instanceFsm.parse('help');
      });
    });
  });

  describe('Close Friends', () => {

    it('Shows close friends after conversation start', async () => {
      return new Promise((resolve, reject) => {
        const initialState = 'conversationStart';
        const instanceFsm = getInstanceFsm(initialState);
        fbClient.sendTextMessage = (psid, text, quickReplies) => {
          console.log(text);
          expect(instanceFsm.fsm.transition.to).to.equal('sayCloseFriends');
        };
        instanceFsm.fsm.on('@closeFriends:end', (event, fsm) => {
          resolve({});
        });
        expect(instanceFsm.fsm.state).to.equal(initialState);
        instanceFsm.parse('close friends');
      });
    });

    it('Shows the first set of suggestions after selecting beginning of conversation', async () => {
      return new Promise((resolve, reject) => {
        const initialState = 'sayCloseFriends';
        const instanceFsm = getInstanceFsm(initialState);
        let msgCount = 0;
        fbClient.sendTextMessage = (psid, text, quickReplies) => {
          console.dir(text);
          expect(instanceFsm.fsm.transition.to).to.equal('sayCloseFriendsBegin');
        }
        instanceFsm.fsm.on('@closeFriendsBegin:end', (event, fsm) => {
          resolve({});
        });
        expect(instanceFsm.fsm.state).to.equal(initialState);
        instanceFsm.parse('close begin');
      });
    });

    it('Shows more questions if you ask for them', async () => {
      return new Promise((resolve, reject) => {
        const initialState = 'sayCloseFriendsBegin';
        const instanceFsm = getInstanceFsm(initialState);
        fbClient.sendTextMessage = (psid, text, quickReplies) => {
          console.dir(text);
        };
        instanceFsm.fsm.on('@closeFriendsBeginMore:end', (event, fsm) => {
          resolve({});
        });
        expect(instanceFsm.fsm.state).to.equal(initialState);
        instanceFsm.parse('more questions');
      });
    });
  });
});
