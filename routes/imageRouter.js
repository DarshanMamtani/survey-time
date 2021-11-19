const router = require('express').Router();
const verifyToken = require('../util/tokenValidation');
const resizeImage = require('../controllers/image.controller');

router.post('/', verifyToken, resizeImage);

module.exports = router;