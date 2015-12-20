import express from './server/express';
import session from './mySession';
import settings from './mySettings';
module.exports = {
  server: {
    express: express
  },
  session: session,
  settings: settings
};
