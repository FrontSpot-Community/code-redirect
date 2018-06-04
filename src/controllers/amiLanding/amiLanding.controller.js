const Joi = require('joi');
const amiRedirectsModel = require('../amiRedirect/amiRedirects.model');
const config = require('../../../configuration');
const logger = require('../../services/logger');


const scheme = Joi.object().keys({
  upsa: Joi.number().integer().min(0).required(),
  tournament: Joi.string().required(),
  task: Joi.string()
});

const getAmiLanding = async (req, res, next) => {
  const { query } = req || {};

  const { error, value } = Joi.validate(query, scheme, { stripUnknown: true });

  if (error) {
    logger.error(`Joi validation error: ${error}`);
    res.status(400).json(error.details);
    return;
  }

  const { upsa, tournament, task } = value;
  logger.debug(`${upsa} ${tournament} ${task}`)

  try {
    const result = await amiRedirectsModel.createOrUpdate(
      upsa,
      tournament,
      task
    );

    if (!result) {
      logger.error('Can\'t save into database: %o', result);
      res.status(500).json('Redirect can\'t be processed');
      return;
    }

    res.redirect(303, `${config.get('endpoints:code-battle')}/${tournament}/${task ? task : ''}`);
  } catch (err) {
    logger.error(`Error during findByPage: ${err}`);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
};


module.exports = {
  getAmiLanding
};
