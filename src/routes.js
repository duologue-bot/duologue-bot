const botUserStoreCtr = require('./store/bot-user');
const verifyMiddlewareCtr = require('./middlewares/verify');
const fbClientCtr = require('./utils/fb-client');
const botStateMachine = require('./state/state-machine');
const authnControllerCtor = require('./controllers/authn');
const webhookControllerCtor = require('./controllers/webhook');
const { Router } = require('express');
const serveStatic = require('serve-static');
const apiPrefix = '/api';

function catchAsyncErrors(fn) {
  return (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => next(err));
    }
  };
}

module.exports = ({ app, config, data }) => {

  const botUserStore = botUserStoreCtr();

  const fbClient = fbClientCtr.client({ config });
  const botSm = botStateMachine.stateMachine({ botUserStore, fbClient, data });
  const verifyMiddleware = verifyMiddlewareCtr(config.facebook.verifyToken);

  const webhookRouter = new Router();
  const webhookControler = webhookControllerCtor({ fbClient, botUserStore, botSm });
  webhookRouter.use(verifyMiddleware);
  webhookRouter.post('/webhook', catchAsyncErrors(webhookControler.handler));
  webhookRouter.get('/webhook', catchAsyncErrors(webhookControler.handler));
  webhookRouter.get('/configuration', (req, res, next) => {
    res.json(data);
  });
  webhookRouter.get('/state', (req, res, next) => {
    res.json(botUserStore.getDatabase());
  });
  app.use(`/api`, webhookRouter);

  webhookControler.bootstrap();
  app.use(serveStatic('static', {'index': ['index.html', 'index.htm']}));

};
