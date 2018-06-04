const { Router } = require('express');
const {
  getAmiLanding
} = require('../../../controllers/amiLanding');

function createLandingRoutes() {
  const router = new Router();

  console.log(getAmiLanding)
  router.get('/ami', getAmiLanding);

  return router;
}

module.exports = {
  createLandingRoutes
};
