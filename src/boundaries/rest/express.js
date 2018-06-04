const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const config = require('../../../configuration');
const logger = require('../../services/logger');
const { checkConnection } = require('../database/db');
const { createLandingRoutes } = require('./v0/metalainding.routes');
const { createRedirectRoutes } = require('./v0/redirect.routes');

const router = express.Router();
const app = express();


app.use(cors(config.get('corsOptions')));

app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(express.json());

app.use(morgan('combined', { stream: logger.stream }));

router.use((req, res, next) => {
  if (checkConnection()) return next();
  res.status(500).json({code: 500, message: 'DB is offline'});
});


router.all('/', (req, res, next) => {
  const rootInfo = {
    'metalanding': `${config.get('endpoints:base')}/metalanding`,
  };
  res.json(rootInfo);
});


app.use('/', router);
app.use('/metalanding', createLandingRoutes());
app.use('/redirect', createRedirectRoutes());

module.exports = app;
