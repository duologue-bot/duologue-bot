const request = require('request-promise-native');

const MAXQUICKREPLIES = 11;
const MAXCHARSMESSAGE = 640;
const GETTINGSTARTEDPAYLOAD = 'START';
const client = ({ config }) => {
  const utils = {};
  const graphApiEndpoint = 'https://graph.facebook.com/v2.7/me';
  const typingDelay = () => { return Math.floor(Math.random() * 200) + 200; }

  function decorateQs(qs = {}) {
    qs.access_token = config.facebook.pageToken;
    return qs;
  }

  function bootstrapRequestPayload(endpoint) {
    return {
      method: 'POST',
      uri: `${graphApiEndpoint}/${endpoint}`,
      qs: decorateQs(),
    };
  }

  function sleep(ms) {
    return new Promise((resolve) => { setTimeout(() => resolve(), ms); });
  }

  async function sendMessage(recipient, payload, delay) {
    const requestPayload = Object.assign({}, bootstrapRequestPayload('messages'), {
      json: {
        recipient: { id: recipient },
        message: payload,
      },
    });

    if (delay === 'natural') {
      const actualDelay = typingDelay();
      await utils.setTyping(recipient, true);
      await sleep(actualDelay);
      await utils.setTyping(recipient, false);
    }

    request(requestPayload);
  }

  async function sendSenderAction(recipient, senderAction) {
    const requestPayload = Object.assign({}, bootstrapRequestPayload('messages'), {
      json: {
        recipient: { id: recipient },
        sender_action: senderAction,
      },
    });
    await request(requestPayload);
  }

  async function setProfilePreference(payload) {
    const requestPayload = Object.assign({}, bootstrapRequestPayload('messenger_profile'), {
      json: payload,
    });
    await request(requestPayload);
  }

  utils.sendTextMessage = async (recipient, text, quickReplies = [], delay = 'natural') => {
    const payload = { text };
    let messageDelay = delay;
    let replies = quickReplies;

    if (typeof replies === 'string') {
      messageDelay = replies;
      replies = [];
    }

    if (replies.length) {
      if (replies.length > MAXQUICKREPLIES) {
        console.log('Quick replies exceeded the max number for a message. ', text);
        replies = replies.splice(0, MAXQUICKREPLIES);
      }

      payload.quick_replies = replies.map((quickReply) => {
        const reply = {
          content_type: 'text',
          title: quickReply,
          payload: quickReply,
        };

        if (typeof quickReply !== 'string') {
          reply.title = quickReply.title;
          reply.payload = quickReply.payload;
          reply.image_url = quickReply.image_url;
        }

        return reply;
      });
    }

    return sendMessage(recipient, payload, messageDelay);
  };

  utils.setTyping = async (recipient, typing) => {
    const action = typing ? 'typing_on' : 'typing_off';
    await sendSenderAction(recipient, action);
  };

  utils.setRead = async (recipient) => {
    const action = 'mark_seen';
    await sendSenderAction(recipient, action);
  };

  utils.setGettingGreetingText = async () => {
    const defaultGreeting = 'Hi {{user_first_name}}! Why not ask me for help?';
    const greetingPayload = {
      greeting: [{
        locale: 'default',
        text: defaultGreeting,
      }],
    };
    return setProfilePreference(greetingPayload);
  };

  utils.sendRemoteImage = async (recipient, image, delay = 'natural') => {
    const payload = {attachment: {type: "image", payload: {url: image}}};
    let messageDelay = delay;

    if (typeof replies === 'string') {
      messageDelay = replies;
      replies = [];
    }

    return sendMessage(recipient, payload, messageDelay);
  };

  return Object.freeze(utils);
};

module.exports = {
  MAXQUICKREPLIES,
  MAXCHARSMESSAGE,
  GETTINGSTARTEDPAYLOAD,
  client,
}
