const resizer = require('node-image-resizer');
const path = require('path');

const setup = {
    all: {
        path: './public/thumbnail/',
    },
    versions: [{
        quality: 100,
        prefix: 'thumbnail_',
        width: 50,
        height: 50
    }]
};

const resizeImage = async (req, res) => {
    try {
        // getting file from request
        const image = req.file;
        const thumbnail = await resizer(image.path, setup);
        res.status(200).send({
            url: thumbnail[0].substr(8)
        });
    } catch (error) {
        res.send(error)
    }
}

module.exports = resizeImage;