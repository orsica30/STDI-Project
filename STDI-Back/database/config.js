const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false); //Evitar error en consola al hacer update

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    /*Esto lo ejecuté para crear la db y el usuario*/
    /*const Users = mongoose.model('serialnumber', {serialNumber: String, profile: String});
        const John = new Users({ serialNumber: '123456', profile: 'PersonalProfile'});
        John.save().then(() => console.log('user created!') );*/

    console.log("DB connection successful");
  } catch (e) {
    console.log(e);
    throw new Error("Error in DB connection!");
  }
};

module.exports = {
  dbConnection,
};
