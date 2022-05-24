const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  
  customImageData: {
    type: [Object],
    blackbox: true, //Este comando es para que el objeto pueda ser recibido sin formato alguno
  },
  //   customImageActive: {
  //     type: Boolean,
  //   },
  //   customImageButtonName: {
  //     type: String,
  //   },
  profileuserdataid: {
    //esta sería como Foreign Key para enlazar el profile con el user
    type: Schema.Types.ObjectId,
    ref: "profileUserData", //hacer referencia al modelo users
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

module.exports = model("customImageUser", UserSchema);
