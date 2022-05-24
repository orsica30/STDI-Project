const { response } = require("express");
const { ImageStream } = require("../helpers/ImageStream");

const getRenderImage = async (req, res = response) => {

    const { userFolder, subfolder, key } = req.params;

    const readStram = ImageStream(userFolder, subfolder, key);

    readStram.pipe(res);
}

module.exports = { getRenderImage };