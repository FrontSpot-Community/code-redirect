const { Router } = require('express');
const {
  postAmiRedirect
} = require('../../../controllers/amiRedirect');

function createRedirectRoutes() {
  const router = new Router();

  router.post('/ami', postAmiRedirect);

  return router;
}

module.exports = {
  createRedirectRoutes
};
