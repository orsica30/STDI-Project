const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  profileFullName: {
    type: String,
    required: true,
  },
  base64ProfilePhoto: {
    type: String,
    //required: true,
    //unique: true,
  },
  base64BannerPhoto: {
    type: String,
    //required: true,
    //unique: true,
  },
  profileBio: {
    type: String,
    //required: true,
  },
  socialMedia: { 
    type: [Object], 
    blackbox: true //Este comando es para que el objeto pueda ser recibido sin formato alguno
    //Ya que no sabemos el orden de RRSS en que se enviará el arreglo al momento de guardar y/o actualizar
  },
  sendNotifications:{
    type: Boolean,
  },
  isLinked:{
    type: Boolean,
  },
  usernameLinked: {
    type: String,
  },
  /*socialMediaSite: {
    type: String,
  },
  instagram: {
    type: String,
  },
  snapchat: {
    type: String,
  },
  youtube: {
    type: String,
  },
  facebook: {
    type: String,
  },
  soundcloud: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  tiktok: {
    type: String,
  },
  twitter: {
    type: String,
  },
  spotify: {
    type: String,
  },
  appleMusic: {
    type: String,
  },
  venmo: {
    type: String,
  },
  cashApp: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  customURL: {
    type: String,
  },*/
  userid: {
    //esta sería como Foreign Key para enlazar el profile con el user
    type: Schema.Types.ObjectId,
    ref: "users", //hacer referencia al modelo users
    required: true,
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

module.exports = model("profileUserData", UserSchema);
