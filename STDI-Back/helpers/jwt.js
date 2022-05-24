const jwt = require("jsonwebtoken");

const generateJWT = (email, userid) => {
  return new Promise((resolve, reject) => {
    const payload = { email, userid };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("The token could not be generated");
        }

        resolve(token);
        //console.log(resolve(token));
        //console.log(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
