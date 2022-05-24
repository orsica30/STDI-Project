const fs = require('fs');
const AWS = require('aws-sdk/clients/s3');

const s3 = new AWS({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.PUBLIC_ACCESS_KEY
})

const deleteFolderInsideBucket= async (params) => {

    const { userFolder, subFolder } = params;

    const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Prefix: `${userFolder}/${subFolder}`,
    }

    const listedObjects = await s3.listObjectsV2(listParams).promise();
    console.log("listedObjects", listedObjects);

    /*Sí la carpeta no contiene objetos, no hacemos nada*/
    if (listedObjects.Contents.length === 0) return;


    const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Delete: { Objects: [] }
    };

    /*Recorremos todos los archivos contenidos en la carpeta 
    y los guardamos en la propiedad "Delete"*/
    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });
    console.log("deleteParams", deleteParams);

    /*Llamamos el método que los elimina de manera asincrona.*/
    const deleteResult = await s3.deleteObjects(deleteParams).promise();
    console.log("deleteResult", deleteResult);
    if (listedObjects.IsTruncated && deleteResult)
    
    await deleteFolderInsideBucket(process.env.AWS_S3_BUCKET_NAME,
    `${userFolder}/${subFolder}`);

}

module.exports = {
    deleteFolderInsideBucket
};