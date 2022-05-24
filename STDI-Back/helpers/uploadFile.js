const fs = require('fs');
const AWS = require('aws-sdk/clients/s3');

const s3 = new AWS({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.PUBLIC_ACCESS_KEY
})

const uploadFile = async (params) => {

    const { userFolder, subFolder, file } = params;

    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Body: fileStream,
        Key: `${userFolder}/${subFolder}/${file.filename}`,
    }

    return s3.upload(uploadParams).promise();
}

module.exports = {
    uploadFile
};