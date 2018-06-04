const mongoose = require('mongoose');

const AmiRedirects = new mongoose.Schema({
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

AmiRedirects.statics.findRedirect = function(upsa, tournament, task) {
  const query = {
    upsa: upsa,
    tournament: tournament,
  };
  if (task) query.task = task;

  return this.find(query, { _id: false, _v: false });
}

AmiRedirects.statics.createOrUpdate = function(upsa, tournament, task) {
  const data = {
    upsa: upsa,
    tournament: tournament,
  };
  if (task) data.task = task;

  return this.update(data, data, { upsert: true });
}

const AmiRedirectsModel = mongoose.model(
  'AmiRedirects',
  AmiRedirects
);


module.exports = AmiRedirectsModel;
