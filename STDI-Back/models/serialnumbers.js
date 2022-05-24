const { Schema, model} = require('mongoose');

const UserSchema = Schema({
  serialNumber: {
      type: String,
      unique: true
  },
  profile: {
      type: String,
      required: true
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  },
  deleted_at: {
    type: Date
  }
});

module.exports = model('serialnumbers', UserSchema);