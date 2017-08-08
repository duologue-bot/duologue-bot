const R = require('ramda');
const { INITIALSTATE } = require('../state/state-machine');
const { GETTINGSTARTEDPAYLOAD } = require('../utils/fb-client');

module.exports = ({ fbClient, botUserStore, botSm }) => {
  const controller = {};

  const messageAction = async (event) => {
    // Do nothing on echo messages for now
    if (event.message.is_echo) return;

    const userPsid = event.sender.id;

    const botUser = await botUserStore.getByFacebookPsid(userPsid);

    let userState = INITIALSTATE;
    let tesUser = null;

    if (botUser) {
      userState = botUser.details.state;
    }

    const instanceFsm = botSm.create(userState, userPsid);
    const text = R.pathOr(event.message.text, ['message', 'quick_reply', 'payload'], event);

    botUserStore.addTextHistory(userPsid, text);

    instanceFsm.parse(text);
  };

  const paramToActionMap = {
    message: messageAction,
  };

  controller.handler = async (req, res) => {
    res.json({ result: 'OK' });
    const { entry: entries = [] } = req.body;

    entries.forEach((entry) => {
      const events = entry.messaging;
      events.forEach((event) => {

        const actions = R.keys(event);
        const actionFns = R.intersection(R.keys(paramToActionMap), actions);

        if (!actionFns.length) {
          console.log('Unhandled message from facebook. Body', event, actions);
          return;
        }

        if (actionFns.length > 1) {
          console.log('Message received from facebook with multiple handlers. Body', event);
        }

        const actionFn = actionFns[0];
        return paramToActionMap[actionFn](event);
      });
    });
  };

  controller.bootstrap = async () => {
    if (!fbClient) return;
    return Promise.all([fbClient.setGreetingText]).then(() => {
      console.log('FB app bootstrapped');
    }).catch((e) => {
      console.log('Failed to bootstrap FB app', e);
    });
  };

  return Object.freeze(controller);
};
