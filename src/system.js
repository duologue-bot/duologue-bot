const pkg = require('../package.json');
const routes = require('./routes');
const Conflab = require('conflab');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sheet = require('./utils/sheet');

const createApp = (config, data) => {
  const app = express();
  app.disable('x-powered-by');
  const jsonParserConfig = (config.express && config.express.bodyParser && config.express.bodyParser.json) || {};
  app.use(bodyParser.json(jsonParserConfig));
  const urlEncodedParserConfig = (config.express && config.express.bodyParser && config.express.bodyParser.urlencoded) || { extended: true };
  app.use(bodyParser.urlencoded(urlEncodedParserConfig));
  const textParserConfig = (config.express && config.express.bodyParser && config.express.bodyParser.text) || { };
  app.use(bodyParser.text(textParserConfig));
  app.use(cookieParser());

  // Prefer environment variables over default ones
  config.facebook.verifyToken = process.env.VERIFY_TOKEN ? process.env.VERIFY_TOKEN : config.facebook.verifyToken;
  config.facebook.pageToken = process.env.PAGE_TOKEN ? process.env.PAGE_TOKEN : config.facebook.pageToken;

  routes({app, config, data});
  return app;
}

module.exports = {
  init: () => {
    const conflab = new Conflab();
    conflab.load((err, config) => {
      const data = {};
      sheet(data).then(() => {
        console.log(`Loaded ${data.questionCount} questions from google sheet ...`);
        server = http.createServer(createApp(config, data));
        server.listen(config.server.port, config.server.host, function () {
          console.log(`Started ${pkg.name} on http://${config.server.host}:${config.server.port}`);
          console.log(`Using configuration for: ${config.facebook.pageName}`);
          setInterval(() => {
            sheet(data).then(() => {
              console.log(`Reloaded ${data.questionCount} questions from google sheet ...`);
            });
          }, 120000);
        });
      });
    });
  }
};
