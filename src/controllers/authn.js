const qs = require('querystring');
const base64url = require('base64url');
const crypto = require('crypto');

module.exports = ({ botUserStore }) => {
  const controller = {};

  controller.link = (req, res) => {
    const rtnLink = '/authn/link/callback';
    const rtnQueryParams = Object.assign({}, req.query);
    const rtnQueryString = qs.stringify(rtnQueryParams, '&', '=', (str) => str);
    const rtn = `${rtnLink}?${rtnQueryString}`;
    const encodedRtn = encodeURIComponent(rtn);

    let signInLink = endpoints.getSync('sign-in/:rtn', environment, { rtn: encodedRtn });

    if (environment.name === 'local') {
      signInLink = signInLink.replace('sign-in', 'authentication-stub');
    }

    return res.redirect(signInLink);
  };

  controller.linkCallback = async (req, res) => {
    let redirectUri = req.query.redirect_uri;

    if (!redirectUri) {
      return res.status(400).json({ error: 'redirect_uri is required' });
    }

    if (!req.user) {
      return res.redirect(redirectUri);
    }

    const user = req.user;
    const authorizationCode = base64url(crypto.randomBytes(64));

    await botUserStore.updateOrCreateWithAuthToken(user.id, authorizationCode);

    const sep = redirectUri.indexOf('?') === -1 ? '?' : '&';
    redirectUri += `${sep}authorization_code=${authorizationCode}`;

    return res.redirect(redirectUri);
  };

  controller.unlink = (req, res) => {
    const psid = req.body.psid;
    // Delete in the db the user with this psid
    // logger.debug(`Is this unlink supposed to be here? User psid ${psid}`);

    return res.json({ result: 'unlink account success' });
  };

  return Object.freeze(controller);
};
