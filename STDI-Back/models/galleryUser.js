const { Schema, model} = require('mongoose');

const UserSchema = Schema({
  galleryImages: { 
    type: [Object], 
    blackbox: true //Este comando es para que el objeto pueda ser recibido sin formato alguno
    //Ya que no sabemos el orden de RRSS en que se enviará el arreglo al momento de guardar y/o actualizar
  },
  galleryActive: {
    type: Boolean,
  },
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

module.exports = model('galleryUser', UserSchema);