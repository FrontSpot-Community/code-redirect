const mongoose = require('mongoose');

const amiRedirects = new mongoose.Schema({
  upsa: Number,
  tournament: {
    type: String,
    trim: true
  },
  task: {
    type: String,
    trim: true
  }
});

amiRedirects.statics.find = function(upsa, tournament, task) {
  const data = {
    upsa: upsa,
    tournament: tournament,
  };
  if (task) data.task = task;

  return this.find(data, { _id: false, _v: false });
}

amiRedirects.statics.createOrUpdate = function(upsa, tournament, task) {
  const data = {
    upsa: upsa,
    tournament: tournament,
  };
  if (task) data.task = task;

  return this.update(data, data, { upsert: true });
}

const AmiRedirectsModel = mongoose.model(
  'amiRedirects',
  amiRedirects
);


module.exports = AmiRedirectsModel;
