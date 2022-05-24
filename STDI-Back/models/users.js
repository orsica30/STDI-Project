const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  serialNumber:{
      type:String,
      unique:true,
  },
  password: {
    type: String,
    //required: true,
  },
  confirmPassword:{
    type: String,
  },
  newPassword: {
    type: String,
  },
  confirmNewPassword: {
    type: String,
  },
  profile:{
    type: String,
  },
  active:{
    type: Boolean,
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

module.exports = model("users", UserSchema);
