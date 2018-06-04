const Joi = require('joi');
const amiRedirectsModel = require('./amiRedirects.model');
const config = require('../../../configuration');
const logger = require('../../services/logger');
const fetch = require('node-fetch');
const httpService = require('../../services/http');


const scheme = Joi.object().keys({
  upsa: Joi.number().required(),
  language: Joi.string().required(),
  tournament: Joi.string().required(),
  task: Joi.string()
});

const postAmiRedirect = async (req, res, next) => {
  // TODO: check the origin that it's code battle!!!!
  const origin = req.get('origin');

  const { body } = req || {};

  const { error, value: data } = Joi.validate(body, scheme, { stripUnknown: true });

  if (error) {
    logger.error(`Joi validation error: ${error}`);
    res.status(400).json(error.details);
    return;
  }

  const { upsa, tournament, task } = data;

  try {
    const result = await amiRedirectsModel.findRedirect(upsa, tournament, task);

    if (!result) {
      logger.error('This task/tournament was not assigned: %o', result);
      res.status(400).json({ error: 'This task/tournament was not assigned' });
      return;
    }

    // Send data about completion to ami
    // TODO: remove the record if this call successful
    await httpService.post(config.get('endpoints:ami'), data)
    logger.debug('Sent to ami: %o', data);

    res.json({ 'status': 'Redirected successfully' })
  } catch (err) {
    logger.error('Error during redirect: %o', err);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }

  next();
};


module.exports = {
  postAmiRedirect
};
