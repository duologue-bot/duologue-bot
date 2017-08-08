const StateMachine = require('state-machine').StateMachine;
const changeCase = require('change-case');
const R = require('ramda');
const messages = require('./state-messages');
const fsmDefinition = require('./state-definition');
const INITIALSTATE = 'index';

const stateMachine = ({ botUserStore, fbClient, data }) => {
  const botFsm = {};
  botFsm.create = ((state, senderPsid) => {
    const instanceFsm = {};
    const instanceFsmDefinition = Object.assign({}, fsmDefinition);
    if (state) {
      instanceFsmDefinition.initial = state;
    }
    var messageFns = messages(fbClient, senderPsid, botUserStore, data);
    instanceFsmDefinition.handlers = messageFns.handlers;
    instanceFsmDefinition.handlers.change = async (event, fsm) => {
      console.log(`${event.type} with action ${event.value}`);
      await botUserStore.updateCurrentState(senderPsid, event.value);
    }

    const fsm = new StateMachine(instanceFsmDefinition);

    // Exposed to allow testing
    instanceFsm.fsm = fsm;

    // Wire up parser
    instanceFsm.parse = messageFns.parse(fsm);

    return Object.freeze(instanceFsm);
  });

  return Object.freeze(botFsm);
};

module.exports = {
  INITIALSTATE,
  stateMachine
}
