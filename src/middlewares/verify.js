module.exports = (verificationToken) => (
  (req, res, next) => {
    const queryVerificationToken = req.query['hub.verify_token'];
    const queryVerificationChallenge = req.query['hub.challenge'];

    if (!queryVerificationToken) return next();

    if (queryVerificationToken === verificationToken) {
      return res.end(queryVerificationChallenge);
    }

    return res.end('Error, wrong validation token');
  }
);
