const { Schema, model} = require('mongoose');

const UserSchema = Schema({
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true
  }
});

module.exports = model('login', UserSchema);