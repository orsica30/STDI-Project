const fs = require('fs');
const AWS = require('aws-sdk/clients/s3');

const s3 = new AWS({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.PUBLIC_ACCESS_KEY
})
const ImageStream = (userFolder, subfolder, filekey) => {

 const downloadParams = {
    /*
    * Esto representa: usuario/carpeta(banner o perfil)/nombre del archivo hasheado por s3
    * EJ: jlzd1994/profile/e377570da38d13450e2c2e2ff1820bc4
    */
    Key: `${userFolder}/${subfolder}/${filekey}`,
    Bucket: process.env.AWS_S3_BUCKET_NAME
 }

 return s3.getObject(downloadParams).createReadStream();
}

module.exports = {
    ImageStream
};