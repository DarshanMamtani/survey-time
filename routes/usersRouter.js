const router = require('express').Router();
const userLogin = require('../controllers/users.controller');

router.post('/auth', userLogin);

module.exports = router;