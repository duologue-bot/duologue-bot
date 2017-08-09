const R = require('ramda');
const Parse = require('./state-parser');

module.exports = (fbClient, senderPsid, botUserStore, data) => {

  const parse = Parse(fbClient, senderPsid)

  /**
   * Default messages per question set
   */
  const defaultMessages = {
    greeting: 'Great, you\'re among friends! An ideal time to catch up on updates in their life since you saw them last! Try something like...',
    more: 'Ok, how about:',
    noMore: 'Sorry - I\'m all out of suggestions!',
    noMoreQuickReplies: [
      { title: '🔁 Start again', payload: 'start' },
      { title: '💗 Thanks', payload: 'thanks' },
    ],
    after: `I hope that helped, what would you like to do next?`,
    afterQuickReplies: [
      { title: '😎 More', payload: 'more' },
      { title: '🔁 Start again', payload: 'start' },
      { title: '💗 Thanks', payload: 'thanks' },
    ],
  }

  /**
   * Helper to iterate through questions for a specific state
   */
  const sendQuestions = async (senderPsid, questionKey, messages) => {
    const numResponses = 2;
    const questions = data.stateQuestions[questionKey] || [];
    const index = await botUserStore.getQuestionIndex(senderPsid, questionKey) || 0;
    let newIndex = index;
    if (index === -1) {
      await fbClient.sendTextMessage(senderPsid, messages.noMore, messages.noMoreQuickReplies);
      return;
    }
    if (messages.greeting && index === 0 && questions[index]) { await fbClient.sendTextMessage(senderPsid, messages.greeting); }
    if (messages.more && index !== 0) { await fbClient.sendTextMessage(senderPsid, messages.more); }
    for (var i = index; i < index + numResponses; i ++) {
      if (questions[i]) {
        newIndex = newIndex + 1;
        await fbClient.sendTextMessage(senderPsid, questions[i]);
      } else {
        newIndex = -1;
      }
    }
    if (newIndex > 0 && messages.after) { await fbClient.sendTextMessage(senderPsid, messages.after, messages.afterQuickReplies); }
    if (newIndex === -1 && messages.noMore) { await fbClient.sendTextMessage(senderPsid, messages.noMore, messages.noMoreQuickReplies); }
    await botUserStore.setQuestionIndex(senderPsid, questionKey, newIndex);
  }

  /**
   * State handlers
   */
  const sayIndex = async (event, fsm) => {
    const quickReplies = [
      { title: '🔎 What\'s this?', payload: 'help' },
      { title: '⏯ Start!', payload: 'conv start' },
    ];
    await fbClient.sendTextMessage(senderPsid, `What would you like to do? Pick a card...`, quickReplies);
  };

  const sayHelp = async (event, fsm) => {
    await fbClient.sendTextMessage(senderPsid, `
        My name's Duologue and I rescue you from uncomfortable silences by feeding you relevant questions to keep the conversation going.  `);
    const quickReplies = [
      { title: '⏯ Let\'s go!', payload: 'start' },
    ];
    await fbClient.sendTextMessage(senderPsid, `
        To give you the right options, I'm going to ask you a few questions first. Ready?`, quickReplies);
  };

  const sayCaitlin = async (event, fsm) => {
    await fbClient.sendRemoteImage(senderPsid, image=`http://pmdvod.nationalgeographic.com/NG_Video/290/458/161209-feather-star-vin_txtd_stereo_ds1602001-226_640x360_829247555597.jpg`);
  };

  const sayClifton = async (event, fsm) => {
    await fbClient.sendRemoteImage(senderPsid, image=`http://static2.stuff.co.nz/1488230793/311/17575311.jpg`);
  };

  const sayThanks = async (event, fsm) => {
    const message = data.thanks[Math.floor(Math.random() * data.thanks.length)];
    await fbClient.sendTextMessage(senderPsid, message);
    await fbClient.sendTextMessage(senderPsid, `🤓`);
  };

  const saySubmit = async (event, fsm) => {
    await fbClient.sendTextMessage(senderPsid, `Here at Duologue Central we're always happy to put more questions in our files! 🗄 Type your question below.`);
    await fbClient.sendTextMessage(senderPsid, `When you're done say 'start' to start over, 'submit' to submit another question, or 'thanks' if you're ready to leave!`);
  };

  const conversationStart = async (event, fsm) => {
    const quickReplies = [
      { title: '💑 Close friends', payload: 'close friends' },
      { title: '👐 Acquaintances', payload: 'acquaintances' },
      { title: '👥 Strangers', payload: 'strangers' },
      { title: '☢ RESCUE ME!!', payload: 'panic' },
      { title: '❓ Submit a question', payload: 'submit' },
    ];
    await fbClient.sendTextMessage(senderPsid, `Great, let\'s get started. Who are you with?`, quickReplies);
  };

  const sayCloseFriends = async (event, fsm) => {
    const quickReplies = [
      { title: '🚆 Starting', payload: 'close begin' },
      { title: '🎢 In the middle', payload: 'close middle' },
      { title: '🚉 Wrapping up', payload: 'close end' },
      { title: '☢ RESCUE ME!!', payload: 'panic' },
      { title: '🔎 What is this?', payload: 'help' },
    ];
    await fbClient.sendTextMessage(senderPsid, `Okay, and where are you in the conversation?`, quickReplies);
 };

  const sayCloseFriendsBegin = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'Great, you\'re among friends! An ideal time to catch up on updates in their life since you saw them last! Try something like...',
    });
    await sendQuestions(senderPsid, 'sayCloseFriendsBegin', messages);
  };

  const sayCloseFriendsMiddle = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'Great, you\'re among friends, literally! I\'m guessing you\'ve already caught up on their news since you saw them last. After that you can go deep. Try one of these...',
    });
    await sendQuestions(senderPsid, 'sayCloseFriendsMiddle', messages);
  };

  const sayCloseFriendsEnd = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'Parting is such sweet sorrow! To gently wrap up a conversation, start talking about the future.',
    });
    await sendQuestions(senderPsid, 'sayCloseFriendsEnd', messages);
  };

  const sayAcquaintances = async (event, fsm) => {
    const quickReplies = [
      { title: '🚆 Starting', payload: 'acquaintances begin' },
      { title: '🎢 In the middle', payload: 'acquaintances middle' },
      { title: '🚉 Wrapping up', payload: 'acquaintances end' },
      { title: '☢ RESCUE ME!!', payload: 'panic' },
      { title: '🔎 What is this?', payload: 'help' },
    ];
    await fbClient.sendTextMessage(senderPsid, `Great, and where are you in the conversation?`, quickReplies);
  };

  const sayAcquaintancesBegin = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'Okay, cool! Since you already know one or two people here, try catching up with their news first.  Don\'t be afraid to ask for a reminder about how you know them!',
    });
    await sendQuestions(senderPsid, 'sayAcquaintancesBegin', messages);
  };

  const sayAcquaintancesMiddle = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'Okay, cool! I\'m guessing you\'ve already caught up with the people you know about their news. So now you could try something about where you are or recent/upcoming events.',
    });
    await sendQuestions(senderPsid, 'sayAcquaintancesMiddle', messages);
  };

  const sayAcquaintancesEnd = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'You did it! You can wrap up the conversation gracefully at networking events by using these polite exit lines:',
    });
    await sendQuestions(senderPsid, 'sayAcquaintancesEnd', messages);
  };

  const sayStrangers = async (event, fsm) => {
    const quickReplies = [
     { title: '🚆 Starting', payload: 'strangers begin' },
     { title: '🎢 In the middle', payload: 'strangers middle' },
     { title: '🚉 Wrapping up', payload: 'strangers end' },
     { title: '☢ RESCUE ME!!', payload: 'panic' },
     { title: '🔎 What is this?', payload: 'help' },
    ];
    await fbClient.sendTextMessage(senderPsid, `Great, and where are you in the conversation?`, quickReplies);
  };

  const sayStrangersBegin = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'Okay, no sweat! How about an easy opener: smile, keep your shoulders relaxed and say, "Hi, how are you?"  After that, try an open ended question like...',
    });
    await sendQuestions(senderPsid, 'sayStrangersBegin', messages);
  };

  const sayStrangersMiddle = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'Deep breath! Try redirecting back to an earlier point in the conversation, or asking a question about their interests.',
    });
    await sendQuestions(senderPsid, 'sayStrangersMiddle', messages);
  };

  const sayStrangersEnd = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'You did it! You can wrap up the conversation gracefully at networking events by using these polite exit lines:',
    });
    await sendQuestions(senderPsid, 'sayStrangersEnd', messages);
  };

  const sayPanic = async (event, fsm) => {
    const messages = Object.assign(defaultMessages, {
      greeting: 'Don\'t worry! Try these emergency questions:',
    });
    await sendQuestions(senderPsid, 'sayPanic', messages);
  };

  // Wrap all the handlers to stop / resume the FSM
  const handlers = {}

  const rawHandlers = [
    sayIndex,
    sayHelp,
    sayPanic,
    sayThanks,
    sayCaitlin,
    sayClifton,
    conversationStart,
    sayCloseFriends,
    sayCloseFriendsBegin,
    sayCloseFriendsMiddle,
    sayCloseFriendsEnd,
    sayAcquaintances,
    sayAcquaintancesBegin,
    sayAcquaintancesMiddle,
    sayAcquaintancesEnd,
    sayStrangers,
    sayStrangersBegin,
    sayStrangersMiddle,
    sayStrangersEnd,
  ];

  rawHandlers.map((handler) => {
    handlers[handler.name] = async (event, fsm) => {
      fsm.pause();
      await handler(event, fsm);
      fsm.resume();
    }
  });

  return {
    parse,
    handlers,
  };
}
