module.exports = (fbClient, senderPsid) => (fsm) => (text = '') => {
  const currentState = fsm.state
  console.log(`Received ${text} at state ${fsm.state}`);
  text = text.toLowerCase();
  fbClient.setRead(senderPsid);
  /**
   * Help
   */
  if (text.indexOf('help') >= 0) {
    fsm.do('help');
    return;
  }
  if (text.indexOf('remind') >= 0) {
    fsm.do('help');
    return;
  }
  if (text.indexOf('what is this') >= 0) {
    fsm.do('help');
    return;
  }
  if (text.indexOf('thanks') >= 0) {
    fsm.do('thanks');
    return;
  }
  if (text.indexOf('thank you') >= 0) {
    fsm.do('thanks');
    return;
  }

  /**
   * Robot
   */
  if (text.indexOf('who are') >= 0) {
    fsm.do('robot');
    return;
  }
  if (text.indexOf('who is your') >= 0) {
    fsm.do('robot');
    return;
  }
  if (text.indexOf('are you') >= 0) {
    fsm.do('robot');
    return;
  }
  if (text.indexOf('do you') >= 0) {
    fsm.do('robot');
    return;
  }
  if (text.indexOf('sex') >= 0) {
    fsm.do('robot');
    return;
  }
  if (text.indexOf('bot') >= 0) {
    fsm.do('robot');
    return;
  }

  /**
   * Close Friends
   */
  if (currentState === 'sayCloseFriends') {
    if (text.indexOf('close begin') >= 0) {
      fsm.do('closeFriendsBegin');
      return;
    }
     if (text.indexOf('close end') >= 0) {
      fsm.do('closeFriendsEnd');
      return;
    }
     if (text.indexOf('close middle') >= 0) {
      fsm.do('closeFriendsMiddle');
      return;
    }
  }
  if (text.indexOf('more') >= 0) {
    if (currentState === 'sayCloseFriendsBegin') {
      fsm.do('closeFriendsBeginMore');
      return;
    }
    if (currentState === 'sayCloseFriendsMiddle') {
      fsm.do('closeFriendsMiddleMore');
      return;
    }
    if (currentState === 'sayCloseFriendsEnd') {
      fsm.do('closeFriendsEndMore');
      return;
    }
  }
  if (text.indexOf('close friends') >= 0) {
    fsm.do('closeFriends');
    return;
  }

  /**
   * Acquaintances
   */
  if (currentState === 'sayAcquaintances') {
    if (text.indexOf('acquaintances begin') >= 0) {
      fsm.do('acquaintancesBegin');
      return;
    }
     if (text.indexOf('acquaintances end') >= 0) {
      fsm.do('acquaintancesEnd');
      return;
    }
     if (text.indexOf('acquaintances middle') >= 0) {
      fsm.do('acquaintancesMiddle');
      return;
    }
  }
  if (text.indexOf('more') >= 0) {
    if (currentState === 'sayAcquaintancesBegin') {
      fsm.do('acquaintancesBeginMore');
      return;
    }
    if (currentState === 'sayAcquaintancesMiddle') {
      fsm.do('acquaintancesMiddleMore');
      return;
    }
    if (currentState === 'sayAcquaintancesEnd') {
      fsm.do('acquaintancesEndMore');
      return;
    }
  }
  if (text.indexOf('acquaintances') >= 0) {
    fsm.do('acquaintances');
    return;
  }

  /**
   * Strangers
   */
  if (currentState === 'sayStrangers') {
    if (text.indexOf('strangers begin') >= 0) {
      fsm.do('strangersBegin');
      return;
    }
     if (text.indexOf('strangers end') >= 0) {
      fsm.do('strangersEnd');
      return;
    }
     if (text.indexOf('strangers middle') >= 0) {
      fsm.do('strangersMiddle');
      return;
    }
  }
  if (text.indexOf('more') >= 0) {
    if (currentState === 'sayStrangersBegin') {
      fsm.do('strangersBeginMore');
      return;
    }
    if (currentState === 'sayStrangersMiddle') {
      fsm.do('strangersMiddleMore');
      return;
    }
    if (currentState === 'sayStrangersEnd') {
      fsm.do('strangersEndMore');
      return;
    }
  }
  if (text.indexOf('strangers') >= 0) {
    fsm.do('strangers');
    return;
  }

  /**
   * Panic
   */
  if (text.indexOf('panic') >= 0) {
    fsm.do('panic');
    return;
  }
  if (text.indexOf('more') >= 0) {
    if (currentState === 'sayPanic') {
      fsm.do('panicMore');
      return;
    }
  }

  /**
   * Fun Stuff
   */
  if (text.indexOf('cait') >= 0) {
    fsm.do('caitlin');
    return;
  }
  if (text.indexOf('clif') >= 0) {
    fsm.do('clifton');
    return;
  }

  if (text.indexOf('submit') >= 0) {
    fsm.do('submit');
    return;
  }

  /**
   * Conversation start
   */
  const shouldConvStart = text.indexOf('start') >= 0 ||
    text.indexOf('conv start') >= 0 ||
    text.indexOf('go') >= 0 ||
    text.indexOf('yes') >= 0;

  if (shouldConvStart) {
    fsm.do('start');
    return;
  }
  if (currentState === 'showSubmit') {
      return;
  }

  fsm.do('index');
};
