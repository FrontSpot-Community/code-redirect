const { Router } = require('express');
const {
  postAmiRedirect
} = require('../../../controllers/amiRedirect');

function createRedirectRoutes() {
  const router = new Router();

  router.get('/ami', postAmiRedirect);

  return router;
}

module.exports = {
  createRedirectRoutes
};
